package routes

import "../views"

func initProductsRoutes() {
	App.GET("/product/:product_id", views.GetProduct)
}
