package routes

import (
	"aroma/handlers"
	"aroma/middlewares"
)

func initProductsRoutes() {
	App.GET("/product/:product_id", handlers.GetProduct)
	App.GET("/product/search", handlers.SearchProducts)
	App.GET("/product/top", handlers.TopProducts)
	App.GET("/test_login_required", middlewares.LoginRequired(handlers.TestLoginRequired))
	App.POST("/product/upload_photo", handlers.UploadProductPhoto)
	App.GET("/get_attachment_url", handlers.GetAttachmentUrl)
}
