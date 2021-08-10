package routes

import (
	"aroma/access_decorators"
	"aroma/handlers"
	"aroma/models"
)

func initAdminPanelRoutes() {
	App.POST("/admin/product", access_decorators.AdminRoleRequired(handlers.UpdateProductInfo))
	App.POST("/admin/catalog", access_decorators.AdminRoleRequired(handlers.UpdateCatalogInfo))
	App.DELETE("/admin/catalog", access_decorators.AdminRoleRequired(handlers.DeleteRecord(&models.Catalog{}, "catalogID")))
	App.DELETE("/admin/product", access_decorators.AdminRoleRequired(handlers.DeleteRecord(&models.Product{}, "productID")))
}
