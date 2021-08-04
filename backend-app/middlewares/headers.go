package middlewares

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func HeadersMiddleware() gin.HandlerFunc {
	return func(context *gin.Context) {
		context.Header("Access-Control-Allow-Origin", "*")
		context.Header("Access-Control-Allow-Headers", "Content-Type, X-Auth-Token, Authorization, Origin")
		if context.Request.Method == "OPTIONS" {
			context.AbortWithStatus(http.StatusOK)
			return
		}
		context.Next()
	}
}
