package routes

import (
	"aroma/handlers"
)

func initCatalogsRoutes() {
	App.GET("/catalog/:catalog_id", handlers.GetCatalog)
	App.GET("/catalog", handlers.GetAllCatalogs)
	App.GET("/catalog/get_attributes", handlers.GetAttributes)
}
