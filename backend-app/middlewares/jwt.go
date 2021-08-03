package middlewares

import (
	"aroma/services"
	"fmt"
	"net/http"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

func LoginRequired(handler func(*gin.Context)) func(*gin.Context) {
	return func(context *gin.Context) {
		tokenString := context.GetHeader("Authorization")
		if len(tokenString) == 0 {
			context.AbortWithStatus(http.StatusBadRequest)
			return
		}
		token, err := services.JWTAuthService().ValidateToken(tokenString)
		if token.Valid {
			claims := token.Claims.(jwt.MapClaims)
			context.Set("userClaims", claims)
		} else {
			fmt.Println(err)
			context.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		handler(context)
	}
}
