package main

import "github.com/gin-gonic/gin"

func HeadersMiddleware() gin.HandlerFunc {
	return func(context *gin.Context) {
		SetHeaders(context)
		println("Огурчик")
		context.Next()
	}
}

func SetHeaders(context *gin.Context) {
	context.Header("Access-Control-Allow-Origin", "http://localhost:8000")
	context.Header("Access-Control-Allow-Headers", "Content-Type, X-Auth-Token, Authorization, Origin")
	context.Header("Access-Control-Allow-Methods", "POST, PUT")
}
