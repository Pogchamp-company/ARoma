package routes

import (
	"aroma/access_decorators"
	"aroma/handlers"
)

func initProductsRoutes() {
	App.GET("/product/:product_id", handlers.GetProduct)
	App.GET("/product/search", handlers.SearchProducts)
	App.GET("/product/top", handlers.TopProducts)
	App.GET("/product/photo", handlers.GetAttachmentUrl)
	App.POST("/product/photo", access_decorators.AdminRoleRequired(handlers.UploadProductPhoto))
	App.DELETE("/product/photo", access_decorators.AdminRoleRequired(handlers.DeleteProductPhoto))
}
