package middlewares

import (
	service "aroma/services"
	"fmt"
	"net/http"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

func AuthorizeJWT() gin.HandlerFunc {
	return func(c *gin.Context) {
		const BearerSchema = "Bearer"
		authHeader := c.GetHeader("Authorization")
		tokenString := authHeader[len(BearerSchema):]
		token, err := service.JWTAuthService().ValidateToken(tokenString)
		if token.Valid {
			claims := token.Claims.(jwt.MapClaims)
			fmt.Println(claims)
		} else {
			fmt.Println(err)
			c.AbortWithStatus(http.StatusUnauthorized)
		}

	}
}

func LoginRequired(handler func(*gin.Context)) func(*gin.Context) {
	return func(context *gin.Context) {
		const BearerSchema = "Bearer"
		authHeader := context.GetHeader("Authorization")
		if len(authHeader) <= len(BearerSchema) {
			context.AbortWithStatus(http.StatusBadRequest)
			return
		}
		tokenString := authHeader[len(BearerSchema):]
		token, err := service.JWTAuthService().ValidateToken(tokenString)
		if token.Valid {
			claims := token.Claims.(jwt.MapClaims)
			fmt.Println(claims)
		} else {
			fmt.Println(err)
			context.AbortWithStatus(http.StatusUnauthorized)
		}

		handler(context)
	}
}
