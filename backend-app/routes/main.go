package routes

import "github.com/gin-gonic/gin"

func InitRoutes() {
	initProductsRoutes()
	initCatalogsRoutes()
}

var App = gin.Default()
