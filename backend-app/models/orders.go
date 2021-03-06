package models

import (
	"database/sql/driver"
	"github.com/jackc/pgtype"
)

type OrderStatus string

const (
	draft           OrderStatus = "DRAFT"
	notPaid         OrderStatus = "NOT_PAID"
	paid            OrderStatus = "PAID"
	shipment        OrderStatus = "SHIPMENT"
	awaitingReceipt OrderStatus = "AWAITING_RECEIPT"
	completed       OrderStatus = "COMPLETED"
)

func (p *OrderStatus) Scan(value interface{}) error {
	*p = OrderStatus(value.(string))
	return nil
}

func (p OrderStatus) Value() (driver.Value, error) {
	return string(p), nil
}

type Order struct {
	BaseModel
	Status           OrderStatus
	CustomerID       int
	Customer         User
	ShippingMethodID int
	ShippingMethod   ShippingMethod
	CouponCodeID     int
	CouponCode       CouponCode
	Products         []Product `gorm:"many2many:product_order"`
	OrderDetails     OrderDetails
}

type ProductCredentials struct {
	ID       int
	Quantity int
}

func NewOrder(customer User,
	shippingMethod ShippingMethod,
	productsData []ProductCredentials,
	couponCode CouponCode) (Order, error) {
	order := Order{
		Status:           draft,
		CustomerID:       customer.ID,
		Customer:         customer,
		ShippingMethodID: shippingMethod.ID,
		ShippingMethod:   shippingMethod,
		CouponCode:       couponCode,
	}
	if couponCode.ToBool() {
		Db.Create(&order)
	} else {
		Db.Select("CustomerID", "ShippingMethodID").Create(&order)
	}

	for _, productData := range productsData {
		var product Product
		Db.First(&product, productData.ID)
		if !product.ToBool() {
			continue
		}
		NewOrderProduct(order, product, productData.Quantity)
	}
	return order, nil
}

func (obj Order) Total() float32 {
	if !obj.ToBool() {
		return 0
	}
	shippingPrice := obj.ShippingMethod.Price
	sale := float32(obj.CouponCode.Sale)
	var total float32
	var products []OrderProduct
	err := Db.Preload("Product").Where("order_id = ?", obj.ID).Find(&products).Error
	if err != nil {
		return 0
	}
	for _, product := range products {
		total += product.Product.Price * float32(product.Quantity)
	}
	return (total * (100 - sale) / 100) + shippingPrice
}

type OrderProduct struct {
	OrderID   int
	ProductID int
	Product   Product
	Quantity  int
}

func NewOrderProduct(order Order,
	product Product,
	quantity int) (OrderProduct, error) {
	if product.QuantityInStock < quantity {
		quantity = product.QuantityInStock
	}
	orderProduct := OrderProduct{
		OrderID:   order.ID,
		ProductID: product.ID,
		Quantity:  quantity,
	}
	query := Db.Create(&orderProduct)
	return orderProduct, query.Error
}

func (obj OrderProduct) TableName() string {
	return "product_order"
}

type ShippingMethod struct {
	BaseModel
	Title string
	Price float32
}

func (obj *ShippingMethod) LoadByID(id int) {
	Db.First(&obj, id)
}

type CouponCode struct {
	BaseModel
	Title     string
	Sale      int
	ExpiredAt pgtype.Date
}

type Address struct {
	BaseModel
	Country string
	City    string
	Route   string
	ZipCode string
}

type OrderDetails struct {
	OrderID        int
	FirstName      string
	LastName       string
	PhoneNumber    string
	AddressID      int
	Address        Address
	ExtraInfo      string
	TrackingNumber string
}
