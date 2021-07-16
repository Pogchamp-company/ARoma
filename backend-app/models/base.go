package models

import (
	"fmt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"net/url"
	"os"
)

func getDSN(uri string) string {
	url_, _ := url.Parse(uri)
	password, _ := url_.User.Password()
	return fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable", // Data source name
		url_.Hostname(),
		url_.User.Username(),
		password,
		url_.Path[1:],
		url_.Port(),
	)
}

func GetConnection(uri string) gorm.Dialector {
	return postgres.Open(getDSN(uri))
}

var Db, _ = gorm.Open(GetConnection(os.Getenv("POSTGRESQL_URI")), &gorm.Config{})
