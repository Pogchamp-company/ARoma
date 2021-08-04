package routes

import (
	"aroma/handlers"
)

func initOrdersRoutes() {
	App.GET("/order/shipping_methods", handlers.GetAllShippingMethods)
	App.GET("/order/check_coupon", handlers.CheckCoupon)
}
