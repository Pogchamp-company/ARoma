package routes

import "github.com/gin-gonic/gin"

func InitRoutes() {
	initProductsRoutes()
	initCatalogsRoutes()
	initUsersRoutes()
}

var App = gin.Default()
