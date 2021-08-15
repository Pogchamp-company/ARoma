package handlers

import (
	"aroma/dto"
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

func SendOrder(context *gin.Context) {
	orderID, err := strconv.ParseInt(context.Request.URL.Query().Get("orderID"), 10, 64)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{
			"errors": "Incorrect id",
		})
		return
	}
	var order models.Order
	models.Db.First(&order, orderID)
	user, _ := context.Get("currentUser")
	if order.CustomerID != user.(models.User).ID {
		context.AbortWithStatus(http.StatusForbidden)
		return
	}
	var credentials dto.OrderDetailsCredentials
	err = context.ShouldBind(&credentials)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{
			"errors": err,
		})
		return
	}
	address := models.Address{
		Country: credentials.Country,
		City:    credentials.City,
		Route:   credentials.Route,
		ZipCode: credentials.ZipCode,
	}
	err = models.Db.Create(&address).Error
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{
			"errors": "Error when creating address object",
		})
		return
	}
	details := models.OrderDetails{
		OrderID:     order.ID,
		FirstName:   credentials.FirstName,
		LastName:    credentials.LastName,
		PhoneNumber: credentials.PhoneNumber,
		ExtraInfo:   credentials.ExtraInfo,
		AddressID:   address.ID,
	}
	err = models.Db.Create(&details).Error
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{
			"errors": "Error when creating order details object",
		})
		return
	}
	err = models.Db.Model(&order).Update("status", "NOT_PAID").Error
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{
			"errors": "Error when updating order status",
		})
		return
	}
	context.JSON(http.StatusOK, gin.H{
		"ok": true,
	})
}

func PayOrder(context *gin.Context) {
	orderID, err := strconv.ParseInt(context.Request.URL.Query().Get("orderID"), 10, 64)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{
			"errors": "Incorrect id",
		})
		return
	}
	var order models.Order
	models.Db.First(&order, orderID)
	user, _ := context.Get("currentUser")
	if order.CustomerID != user.(models.User).ID {
		context.AbortWithStatus(http.StatusForbidden)
		return
	}
	if order.Status != "NOT_PAID" {
		context.AbortWithStatus(http.StatusForbidden)
		return
	}

	// ToDo: Payment logic

	models.Db.Model(&order).Update("status", "PAID")
	context.JSON(http.StatusOK, gin.H{
		"ok": true,
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
	orderID, err := strconv.ParseInt(context.Request.URL.Query().Get("orderID"), 10, 64)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{
			"errors": "Incorrect id",
		})
		return
	}
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
