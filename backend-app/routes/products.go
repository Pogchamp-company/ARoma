package routes

import "aroma/views"

func initProductsRoutes() {
	App.GET("/product/:product_id", views.GetProduct)
	App.GET("/product/search", views.SearchProducts)
}
