package handlers

import (
	"aroma/dto"
	"aroma/models"
	"aroma/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Login(context *gin.Context) {
	var credentials dto.LoginCredentials
	err := context.ShouldBind(&credentials)
	if err != nil {
		context.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"errors": err,
		})
		return
	}
	token, ok := services.LoginUser(credentials)
	if !ok {
		context.AbortWithStatus(http.StatusBadRequest)
		return
	}
	// ToDo: Delete duplicated query
	user := models.User{}
	models.Db.Where("email = ? OR nickname = ?", credentials.Login, credentials.Login).First(&user)
	context.JSON(http.StatusOK, gin.H{
		"token":   token,
		"isAdmin": user.IsAdmin,
	})
}
