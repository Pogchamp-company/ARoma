package models

import (
	"aroma/config"
	"fmt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"net/url"
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

func openDialectorConnection(uri string) gorm.Dialector {
	return postgres.Open(getDSN(uri))
}

func openGormConnection(dialector gorm.Dialector) *gorm.DB {
	conn, err := gorm.Open(dialector, &gorm.Config{})
	if err != nil {
		panic(err)
	}
	return conn
}

var Db = openGormConnection(openDialectorConnection(config.Config.PostgresqlUri))
