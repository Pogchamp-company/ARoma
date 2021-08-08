package config

import (
	"github.com/gin-gonic/gin"
	"os"
	"strconv"
)

type appConfig struct {
	Debug             bool
	PostgresqlUri     string
	MinioEndpoint     string
	MinioAccessKey    string
	MinioSecretKey    string
	MinioSecure       bool
	JWTSecretKey      string
	ProductsPageLimit int
}

func getEnvWithDefault(key, fallback string) string {
	value := os.Getenv(key)
	if len(value) == 0 {
		return fallback
	}
	return value
}

func getConfig() *appConfig {
	ProductsPageLimit, err := strconv.ParseInt(getEnvWithDefault("PRODUCTS", "12"), 10, 64)
	if err != nil {
		panic(err)
	}
	return &appConfig{
		Debug:             getEnvWithDefault("GIN_MODE", gin.DebugMode) == gin.ReleaseMode,
		PostgresqlUri:     getEnvWithDefault("POSTGRESQL_URI", "postgresql://postgres@localhost:5432/aroma"),
		MinioEndpoint:     getEnvWithDefault("MINIO_ENDPOINT", "127.0.0.1:9001"),
		MinioAccessKey:    getEnvWithDefault("MINIO_ACCESS_KEY", "minio"),
		MinioSecretKey:    getEnvWithDefault("MINIO_SECRET_KEY", "minio123"),
		MinioSecure:       getEnvWithDefault("MINIO_SECRET_KEY", "") != "",
		JWTSecretKey:      getEnvWithDefault("JWT_SECRET_KEY", "secret"),
		ProductsPageLimit: int(ProductsPageLimit),
	}
}

var Config = getConfig()
