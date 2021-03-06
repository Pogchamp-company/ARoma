package access_decorators

import (
	"aroma/models"
	"aroma/services"
	"fmt"
	"net/http"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

func LoginRequired(handler gin.HandlerFunc) gin.HandlerFunc {
	return func(context *gin.Context) {
		tokenString := context.GetHeader("Authorization")
		if len(tokenString) == 0 {
			context.AbortWithStatus(http.StatusUnauthorized)
			return
		}
		token, err := services.JWTAuthService().ValidateToken(tokenString)
		if err == nil {
			claims := token.Claims.(jwt.MapClaims)
			var user models.User
			models.Db.Where("email = ?", claims["Email"]).First(&user)
			context.Set("currentUser", user)
		} else {
			fmt.Println(err)
			context.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		handler(context)
	}
}
