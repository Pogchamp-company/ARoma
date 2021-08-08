package access_decorators

import (
	"aroma/models"
	"github.com/gin-gonic/gin"
)

func AdminRoleRequired(handler gin.HandlerFunc) gin.HandlerFunc {
	return LoginRequired(func(context *gin.Context) {
		user, _ := context.Get("currentUser")
		if !user.(models.User).IsAdmin {
			context.AbortWithStatus(403)
			return
		}

		handler(context)
	})
}
