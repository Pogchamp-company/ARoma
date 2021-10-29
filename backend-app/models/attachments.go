package models

import (
	"aroma/config"
	"fmt"
	"github.com/google/uuid"
	"github.com/jackc/pgtype"
)

type Attachment struct {
	BaseModel
	Uuid     pgtype.UUID
	Bucket   string
	FileName string
	FileExt  string
	FileSize int64
}

func (attachment Attachment) ToStr() string {
	return attachment.FileName + "." + attachment.FileExt
}

func (attachment Attachment) ToRepr() string {
	return fmt.Sprintf("<Attachment %d>", attachment.ID)
}

func (attachment Attachment) LoadByID(id int) {
	Db.First(&attachment, id)
}

func (attachment Attachment) GetUrl() string {
	if attachment.ID == 0 {
		return ""
	}
	uuid.New()
	id := uuid.UUID{}
	id.UnmarshalBinary(attachment.Uuid.Bytes[:])
	protocol := "http"
	if config.Config.MinioSecure {
		protocol += "s"
	}
	return fmt.Sprintf("%s://%s/%s/%s.%s",
		protocol,
		config.Config.MinioEndpoint,
		attachment.Bucket,
		id.String(),
		attachment.FileExt)
}
