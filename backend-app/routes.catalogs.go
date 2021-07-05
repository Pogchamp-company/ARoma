package main

func initCatalogsRoutes() {
	App.GET("/catalog/:catalog_id", GetCatalog)
}
