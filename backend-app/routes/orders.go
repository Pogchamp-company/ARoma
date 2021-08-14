package routes

import (
	"aroma/access_decorators"
	"aroma/handlers"
)

func initOrdersRoutes() {
	App.GET("/order/shipping_methods", handlers.GetAllShippingMethods)
	App.GET("/order/check_coupon", handlers.CheckCoupon)
	App.POST("/order/step1", access_decorators.LoginRequired(handlers.CreateOrder))
	App.POST("/order/step2", access_decorators.LoginRequired(handlers.SendOrder))
	App.GET("/order", access_decorators.LoginRequired(handlers.GetOrder))
	App.GET("/order/all", access_decorators.LoginRequired(handlers.GetOrdersList))
}
