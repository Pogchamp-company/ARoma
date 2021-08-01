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
		tokenString := c.GetHeader("Authorization")
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
		tokenString := context.GetHeader("Authorization")
		if len(tokenString) == 0 {
			context.AbortWithStatus(http.StatusBadRequest)
			return
		}
		token, err := service.JWTAuthService().ValidateToken(tokenString)
		if token.Valid {
			claims := token.Claims.(jwt.MapClaims)
			fmt.Println(claims)
		} else {
			fmt.Println(err)
			context.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		handler(context)
	}
}
