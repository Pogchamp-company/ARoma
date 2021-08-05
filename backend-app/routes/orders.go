package routes

import (
	"aroma/handlers"
	"aroma/middlewares"
)

func initOrdersRoutes() {
	App.GET("/order/shipping_methods", handlers.GetAllShippingMethods)
	App.GET("/order/check_coupon", handlers.CheckCoupon)
	App.POST("/order/step1", middlewares.LoginRequired(handlers.CreateOrder))
}
