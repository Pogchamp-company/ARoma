package attachments

var buckets = []string{
	"product-photos",
}

func InitBuckets() {
	for _, bucket := range buckets {
		InitAttachmentManager(bucket).InitBucket()
	}
}
