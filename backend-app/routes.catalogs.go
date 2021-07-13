package main

func initCatalogsRoutes() {
	App.GET("/catalog/:catalog_id", GetCatalog)
	App.GET("/catalog", GetAllCatalogs)
	App.GET("/catalog/get_attributes", GetAttributes)
}
