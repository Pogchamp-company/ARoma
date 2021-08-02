package models

import "database/sql/driver"

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
	ID         int
	Status     OrderStatus
	CustomerID int
	Customer   User
	Products   []Product
}

type OrderProduct struct {
	OrderID   int
	ProductID int
	Count     int
}
