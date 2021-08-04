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
	*p = OrderStatus(value.([]byte))
	return nil
}

func (p OrderStatus) Value() (driver.Value, error) {
	return string(p), nil
}

type Order struct {
	ID               int
	Status           OrderStatus
	CustomerID       int
	Customer         User
	Products         []Product
	ShippingMethodID int
	ShippingMethod   ShippingMethod
}

type OrderProduct struct {
	OrderID   int
	ProductID int
	Count     int
}

type ShippingMethod struct {
	ID    int
	Title string
	Price float32
}

type CouponCode struct {
	ID        int
	Title     string
	Sale      int
	ExpiredAt pgtype.Date
}
