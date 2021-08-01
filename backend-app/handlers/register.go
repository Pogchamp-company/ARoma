package handlers

import (
	"aroma/dto"
	"aroma/services"
	"github.com/gin-gonic/gin"
	"net/http"
)

func RegisterUser(context *gin.Context) {
	var credential dto.RegisterCredentials
	err := context.ShouldBind(&credential)
	if err != nil {
		context.JSON(http.StatusBadRequest, nil)
	}
	token, ok := services.RegisterUser(credential)
	if !ok {
		context.JSON(http.StatusBadRequest, nil)
	}
	context.JSON(http.StatusOK, gin.H{
		"token": token,
	})
}
