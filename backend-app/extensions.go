package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"net/url"
	"os"
)

var App = gin.Default()

func getDSN(rawurl string) string {
	url_, _ := url.Parse(rawurl)
	password, _ := url_.User.Password()
	return fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable", // Data source name
		url_.Hostname(),
		url_.User.Username(),
		password,
		url_.Path[1:],
		url_.Port(),
	)
}

var Db, _ = gorm.Open(postgres.Open(getDSN(os.Getenv("POSTGRESQL_URL"))), &gorm.Config{})
