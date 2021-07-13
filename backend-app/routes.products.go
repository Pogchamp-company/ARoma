package main

func initProductsRoutes() {
	App.GET("/product/:product_id", GetProduct)
	App.GET("/product/search", SearchProducts)
}
