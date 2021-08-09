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
	order, err := models.NewOrder(orderData.Customer, shippingMethod, orderData.Products, orderData.CouponCode)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{
			"Order":        nil,
			"ErrorMessage": err,
		})
		return
	}

	context.JSON(http.StatusOK, gin.H{
		"Order": order.ID,
	})
}

func GetOrder(context *gin.Context) {
	type ApiOrderProduct struct {
		Title    string
		Quantity int
		Price    float32
	}
	type ApiOrder struct {
		Status         models.OrderStatus
		ShippingMethod models.ShippingMethod
		Sale           int
		Products       []ApiOrderProduct
	}
	orderID, _ := strconv.ParseInt(context.Request.URL.Query().Get("orderID"), 10, 64)
	var order models.Order
	models.Db.Preload("ShippingMethod").Preload("CouponCode").First(&order, orderID)
	user, _ := context.Get("currentUser")
	if order.CustomerID != user.(models.User).ID {
		context.AbortWithStatus(http.StatusForbidden)
		return
	}
	var rows []map[string]interface{}
	models.Db.
		Raw("SELECT p.title, po.quantity, p.price "+
			"FROM product_order as po JOIN products p on p.id = po.product_id WHERE po.order_id = ?", orderID).
		Find(&rows)
	var orderProducts []ApiOrderProduct
	for _, row := range rows {
		orderProducts = append(orderProducts, ApiOrderProduct{
			Title:    row["title"].(string),
			Quantity: int(row["quantity"].(int32)),
			Price:    float32(row["price"].(float64)),
		})
	}
	context.JSON(http.StatusOK, gin.H{
		"order": ApiOrder{
			Status:         order.Status,
			ShippingMethod: order.ShippingMethod,
			Sale:           order.CouponCode.Sale,
			Products:       orderProducts,
		},
	})
}

func GetOrdersList(context *gin.Context) {
	type OrderPreview struct {
		ID     int
		Status models.OrderStatus
		Total  float32
	}
	currentUser, _ := context.Get("currentUser")
	var orders []models.Order
	err := models.Db.Preload("ShippingMethod").Preload("CouponCode").
		Where("customer_id = ?", currentUser.(models.User).ID).Find(&orders).Error
	if err != nil {
		panic(err)
		return
	}
	var result []OrderPreview
	for _, order := range orders {
		result = append(result, OrderPreview{
			ID:     order.ID,
			Status: order.Status,
			Total:  order.Total(),
		})
	}
	context.JSON(http.StatusOK, gin.H{
		"orders": result,
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
