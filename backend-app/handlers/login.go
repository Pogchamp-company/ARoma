package handlers

import (
	"aroma/dto"
	"aroma/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

// LoginController login controller interface
type LoginController interface {
	Login(ctx *gin.Context) string
}

type loginController struct {
	loginService services.LoginService
	jWtService   services.JWTService
}

func LoginHandler(loginService services.LoginService, jWtService services.JWTService) LoginController {
	return &loginController{
		loginService: loginService,
		jWtService:   jWtService,
	}
}

func (controller *loginController) Login(ctx *gin.Context) string {
	var credential dto.LoginCredentials
	err := ctx.ShouldBind(&credential)
	if err != nil {
		return ""
	}
	token, _ := services.LoginUser(credential)
	return token
}

func Login(context *gin.Context) {
	var loginService = services.StaticLoginService()
	var jwtService services.JWTService = services.JWTAuthService()
	var loginController = LoginHandler(loginService, jwtService)
	token := loginController.Login(context)
	if token != "" {
		context.JSON(http.StatusOK, gin.H{
			"token": token,
		})
	} else {
		context.JSON(http.StatusUnauthorized, nil)
	}
}
