package routes

import "github.com/gin-gonic/gin"
import "../views"

var App = gin.Default()

func InitRoutes() {
	App.GET("/ping", views.Ping)
	initProductsRoutes()
	initCatalogsRoutes()
}
