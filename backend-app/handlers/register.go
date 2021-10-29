package handlers

import (
	"aroma/dto"
	"aroma/models"
	"aroma/services"
	"aroma/utils"
	"github.com/gin-gonic/gin"
	"net/http"
)

func RegisterUser(context *gin.Context) {
	var credential dto.RegisterCredentials
	err := context.ShouldBind(&credential)
	if err != nil {
		context.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"errors": err,
		})
		return
	}
	token, ok := services.RegisterUser(credential)
	if !ok {
		context.AbortWithStatus(http.StatusBadRequest)
		return
	}
	context.JSON(http.StatusOK, gin.H{
		"token": token,
	})
}

func CheckUsername(context *gin.Context) {
	username := context.Request.URL.Query().Get("username")
	if username == "" {
		context.AbortWithStatus(http.StatusBadRequest)
		return
	}
	var user models.User
	models.Db.Where("nickname = ?", username).First(&user)
	if user.ToBool() {
		context.JSON(http.StatusOK, gin.H{
			"ok": false,
		})
	} else {
		context.JSON(http.StatusOK, gin.H{
			"ok": true,
		})
	}
}

func CheckEmail(context *gin.Context) {
	email := context.Request.URL.Query().Get("email")
	if email == "" {
		context.AbortWithStatus(http.StatusBadRequest)
		return
	}
	if !utils.ValidateEmail(email) {
		context.JSON(http.StatusOK, gin.H{
			"ok": false,
		})
		return
	}
	var user models.User
	models.Db.Where("email = ?", email).First(&user)
	if user.ToBool() {
		context.JSON(http.StatusOK, gin.H{
			"ok": false,
		})
	} else {
		context.JSON(http.StatusOK, gin.H{
			"ok": true,
		})
	}
}
