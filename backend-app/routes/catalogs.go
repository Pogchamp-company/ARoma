package routes

import (
	"aroma/views"
)

func initCatalogsRoutes() {
	App.GET("/catalog/:catalog_id", views.GetCatalog)
	App.GET("/catalog", views.GetAllCatalogs)
	App.GET("/catalog/get_attributes", views.GetAttributes)
}
