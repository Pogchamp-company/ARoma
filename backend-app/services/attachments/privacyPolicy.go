package attachments

import (
	"encoding/json"
	"fmt"
)

func generateBucketPrivacyPolicy(bucket string) string {
	policy := map[string]interface{}{
		"Version": "2012-10-17",
		"Statement": []map[string]interface{}{
			{
				"Action": []string{
					"s3:GetBucketLocation",
					"s3:ListBucket",
					"s3:ListBucketMultipartUploads",
				},
				"Effect": "Allow",
				"Principal": map[string]string{
					"AWS": "*",
				},
				"Resource": []string{
					fmt.Sprintf("arn:aws:s3:::%s", bucket),
				},
				"Sid": "",
			},
			{
				"Action": []string{
					"s3:AbortMultipartUpload",
					"s3:DeleteObject",
					"s3:GetObject",
					"s3:ListMultipartUploadParts",
					"s3:PutObject",
				},
				"Effect": "Allow",
				"Principal": map[string]string{
					"AWS": "*",
				},
				"Resource": []string{
					fmt.Sprintf("arn:aws:s3:::%s/*", bucket),
				},
				"Sid": "",
			},
		},
	}
	result, _ := json.Marshal(policy)
	return string(result)
}
