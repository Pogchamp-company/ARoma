package main

import (
	"fmt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"os"
)

var dsn = fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable", // Data source name
	os.Getenv("DB_HOST"),
	os.Getenv("DB_USER"),
	os.Getenv("DB_PASSWORD"),
	os.Getenv("DB_NAME"),
	os.Getenv("DB_PORT"),
)

var Db, _ = gorm.Open(postgres.Open(dsn), &gorm.Config{})
