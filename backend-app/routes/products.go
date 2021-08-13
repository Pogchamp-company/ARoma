package routes

import (
	"aroma/handlers"
)

func initProductsRoutes() {
	App.GET("/product/:product_id", handlers.GetProduct)
	App.GET("/product/search", handlers.SearchProducts)
	App.GET("/product/top", handlers.TopProducts)
}
