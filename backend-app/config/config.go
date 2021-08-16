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
	OrdersPageLimit   int
}

func getEnvWithDefault(key, fallback string) string {
	value := os.Getenv(key)
	if len(value) == 0 {
		return fallback
	}
	return value
}

func parseIntVar(key, fallback string) int {
	value, err := strconv.ParseInt(getEnvWithDefault(key, fallback), 10, 64)
	if err != nil {
		panic(err)
	}
	return int(value)
}

func getConfig() *appConfig {
	return &appConfig{
		Debug:             getEnvWithDefault("GIN_MODE", gin.DebugMode) == gin.ReleaseMode,
		PostgresqlUri:     getEnvWithDefault("POSTGRESQL_URI", "postgresql://postgres@localhost:5432/aroma"),
		MinioEndpoint:     getEnvWithDefault("MINIO_ENDPOINT", "127.0.0.1:9001"),
		MinioAccessKey:    getEnvWithDefault("MINIO_ACCESS_KEY", "minio"),
		MinioSecretKey:    getEnvWithDefault("MINIO_SECRET_KEY", "minio123"),
		MinioSecure:       getEnvWithDefault("MINIO_SECRET_KEY", "") != "",
		JWTSecretKey:      getEnvWithDefault("JWT_SECRET_KEY", "secret"),
		ProductsPageLimit: parseIntVar("PRODUCTS_PAGE_LIMIT", "12"),
		OrdersPageLimit:   parseIntVar("ORDERS_PAGE_LIMIT", "6"),
	}
}

var Config = getConfig()
