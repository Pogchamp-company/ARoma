package seeds

func ShippingMethodsSeeder() {
	insertFromJSON("shipping_methods", "shipping_methods")
}

func CouponCodesSeeder() {
	insertFromJSON("coupon_codes", "coupon_codes")
}
