package handlers

import (
	"aroma/dto"
	"aroma/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Login(context *gin.Context) {
	var credential dto.LoginCredentials
	err := context.ShouldBind(&credential)
	if err != nil {
		context.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"errors": err,
		})
		return
	}
	token, ok := services.LoginUser(credential)
	if !ok {
		context.AbortWithStatus(http.StatusBadRequest)
		return
	}
	context.JSON(http.StatusOK, gin.H{
		"token": token,
	})
}
