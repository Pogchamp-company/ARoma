package routes

import (
	"aroma/handlers"
	service "aroma/services"
	"github.com/gin-gonic/gin"
	"net/http"
)

func initUsersRoutes() {
	var loginService = service.StaticLoginService()
	var jwtService service.JWTService = service.JWTAuthService()
	var loginController = handlers.LoginHandler(loginService, jwtService)
	App.POST("/login", func(ctx *gin.Context) {
		token := loginController.Login(ctx)
		if token != "" {
			ctx.JSON(http.StatusOK, gin.H{
				"token": token,
			})
		} else {
			ctx.JSON(http.StatusUnauthorized, nil)
		}
	})
}
