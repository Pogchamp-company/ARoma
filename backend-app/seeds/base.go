package seeds

func GetAllSeeds() map[string]func() {
	return map[string]func(){
		"catalogs":         CatalogsSeeder,
		"products":         ProductsSeeder,
		"shipping_methods": ShippingMethodsSeeder,
		"coupon_codes":     CouponCodesSeeder,
	}
}
