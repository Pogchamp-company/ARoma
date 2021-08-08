package routes

import (
	"aroma/access_decorators"
	"aroma/handlers"
)

func initOrdersRoutes() {
	App.GET("/order/shipping_methods", handlers.GetAllShippingMethods)
	App.GET("/order/check_coupon", handlers.CheckCoupon)
	App.POST("/order/step1", access_decorators.LoginRequired(handlers.CreateOrder))
	App.GET("/order", handlers.GetOrder)
}
