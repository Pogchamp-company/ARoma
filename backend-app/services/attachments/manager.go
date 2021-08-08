package attachments

import (
	"aroma/config"
	"aroma/models"
	"context"
	"fmt"
	"github.com/google/uuid"
	"github.com/jackc/pgtype"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"mime/multipart"
	"path/filepath"
)

func initMinioClient() *minio.Client {
	minioClient, err := minio.New(config.Config.MinioEndpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(config.Config.MinioAccessKey, config.Config.MinioSecretKey, ""),
		Secure: config.Config.MinioSecure,
	})
	if err != nil {
		panic(err)
	}
	return minioClient
}

var minioClient = initMinioClient()

type AttachmentManager interface {
	InitBucket()
	Upload(file multipart.FileHeader) (models.Attachment, error)
	Download(attachment models.Attachment) (*minio.Object, error)
}

type attachmentManager struct {
	minioClient *minio.Client
	bucket      string
}

func InitAttachmentManager(bucket string) *attachmentManager {
	return &attachmentManager{
		minioClient: minioClient,
		bucket:      bucket,
	}
}

func (manager *attachmentManager) InitBucket() {
	ctx := context.Background()
	err := manager.minioClient.MakeBucket(ctx, manager.bucket, minio.MakeBucketOptions{})
	if err != nil {
		// Check to see if we already own this bucket (which happens if you run this twice)
		exists, errBucketExists := minioClient.BucketExists(ctx, manager.bucket)
		if errBucketExists != nil || !exists {
			panic(err)
		} else {
			fmt.Println(fmt.Printf("We already own %s\n", manager.bucket))
		}
	} else {
		fmt.Printf("Successfully created %s\n", manager.bucket)
	}
	manager.minioClient.SetBucketPolicy(ctx, manager.bucket, generateBucketPrivacyPolicy(manager.bucket))
}

func (manager attachmentManager) Upload(file *multipart.FileHeader) (models.Attachment, error) {
	var stream, err = file.Open()
	if err != nil {
		return models.Attachment{}, err
	}
	attachmentId := uuid.New()
	fileExt := filepath.Ext(file.Filename)
	contentType := file.Header.Get("Content-Type")
	_, err = minioClient.PutObject(
		context.Background(),
		manager.bucket,
		attachmentId.String()+fileExt,
		stream,
		file.Size,
		minio.PutObjectOptions{ContentType: contentType})
	if err != nil {
		return models.Attachment{}, err
	}
	u := pgtype.UUID{}
	u.Set(attachmentId.String())
	attachment := models.Attachment{
		Uuid:     u,
		Bucket:   manager.bucket,
		FileName: file.Filename,
		FileExt:  fileExt[1:],
		FileSize: file.Size,
	}
	query := models.Db.Create(&attachment)
	return attachment, query.Error
}

func (manager attachmentManager) Download(attachment models.Attachment) (*minio.Object, error) {
	object, err := manager.minioClient.GetObject(
		context.Background(),
		manager.bucket,
		string(attachment.Uuid.Bytes[:]),
		minio.GetObjectOptions{})
	return object, err
}
