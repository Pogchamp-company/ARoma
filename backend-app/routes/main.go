package routes

import "github.com/gin-gonic/gin"

func InitRoutes() {
	initProductsRoutes()
	initCatalogsRoutes()
	initUsersRoutes()
	initOrdersRoutes()
	initAdminPanelRoutes()
}

var App = gin.Default()
