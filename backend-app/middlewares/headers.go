package middlewares

import (
	"github.com/gin-gonic/gin"
	"os"
)

func HeadersMiddleware() gin.HandlerFunc {
	return func(context *gin.Context) {
		context.Header("Access-Control-Allow-Origin", os.Getenv("FRONTEND_HOST"))
		context.Header("Access-Control-Allow-Headers", "Content-Type, X-Auth-Token, Authorization, Origin")
		context.Next()
	}
}
