package routes

import (
	"aroma/access_decorators"
	"aroma/handlers"
)

func initAdminPanelRoutes() {
	App.POST("/product/update", access_decorators.AdminRoleRequired(handlers.UpdateProductInfo))
}
