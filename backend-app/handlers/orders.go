package handlers

import (
	"aroma/models"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
	"time"
)

func CreateOrder(context *gin.Context) {
	type OrderCredentials struct {
		Customer       models.User
		Products       []models.ProductCredentials
		CouponCode     models.CouponCode
		ShippingMethod int
	}
	currentUser, _ := context.Get("currentUser")
	var products []models.ProductCredentials
	err := json.Unmarshal([]byte(context.PostForm("Products")), &products)
	shippingMethodID, err := strconv.ParseInt(context.PostForm("ShippingMethod"), 10, 64)
	if err != nil {
		context.AbortWithStatus(400)
		return
	}
	var couponCode models.CouponCode
	couponCodeTitle := context.PostForm("CouponCode")
	if couponCodeTitle != "" {
		models.Db.Where("title = ?", couponCodeTitle).First(&couponCode)
	}
	orderData := OrderCredentials{
		Customer:       currentUser.(models.User),
		Products:       products,
		CouponCode:     couponCode,
		ShippingMethod: int(shippingMethodID),
	}
	var shippingMethod models.ShippingMethod
	shippingMethod.LoadByID(orderData.ShippingMethod)
	if !shippingMethod.ToBool() {
		context.AbortWithStatus(400)
		return
	}
	order, _ := models.NewOrder(orderData.Customer, shippingMethod, orderData.Products, orderData.CouponCode)

	context.JSON(http.StatusOK, gin.H{
		"Order": order.ID,
	})
}

func GetAllShippingMethods(context *gin.Context) {
	var shippingMethods []models.ShippingMethod
	models.Db.Find(&shippingMethods)
	context.JSON(http.StatusOK, gin.H{
		"ShippingMethods": shippingMethods,
	})
}

func CheckCoupon(context *gin.Context) {
	couponTitle := context.Request.URL.Query().Get("couponTitle")
	var coupon models.CouponCode
	models.Db.Where("title = ?", couponTitle).First(&coupon)
	if coupon.ID == 0 {
		context.AbortWithStatus(http.StatusNotFound)
		return
	}
	if time.Now().After(coupon.ExpiredAt.Time) {
		context.AbortWithStatus(http.StatusGone)
		return
	}
	context.JSON(http.StatusOK, gin.H{
		"Coupon": coupon,
	})
}
