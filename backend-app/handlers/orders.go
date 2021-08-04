package handlers

import (
	"aroma/models"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"time"
)

func CreateOrder(context *gin.Context) {
	type OrderCredentials struct {
		Products []struct {
			ID       int `json:"ID"`
			Quantity int `json:"Quantity"`
		} `json:"Products"`
		CouponCode     string `json:"CouponCode"`
		ShippingMethod int    `json:"ShippingMethod"`
	}
	rawOrderQuery := context.Request.URL.Query().Get("orderData")
	var orderData OrderCredentials
	err := json.Unmarshal([]byte(rawOrderQuery), &orderData)
	if err != nil {
		return
	}
	fmt.Println(orderData)
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
		context.AbortWithStatus(404)
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
