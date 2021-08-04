package models

import (
	"encoding/json"
	"fmt"
	"github.com/jackc/pgtype"
)

type Product struct {
	ID              int
	Title           string
	CatalogID       int
	Catalog         Catalog
	Price           float32
	QuantityInStock int
	Description     string
	LongDescription string
	Attributes      pgtype.JSONB
	ViewsCount      int
}

func NewProduct(title string,
	catalog Catalog,
	price float32,
	quantityInStock int,
	description string,
	longDescription string,
	attributes map[string]string) (Product, error) {
	marshalAttrs, err := json.Marshal(attributes)
	if err != nil {
		return Product{}, err
	}
	product := Product{
		Title:           title,
		Catalog:         catalog,
		Price:           price,
		QuantityInStock: quantityInStock,
		Description:     description,
		LongDescription: longDescription,
		Attributes: pgtype.JSONB{
			Status: pgtype.Present,
			Bytes:  marshalAttrs,
		},
	}
	Db.Create(&product)
	return product, nil
}

func (obj Product) Str() string {
	return obj.Title
}

func (obj Product) Repr() string {
	return fmt.Sprintf("<Product (id=%s, title=%s)>", fmt.Sprint(obj.ID), obj.Title)
}

func (obj Product) Bool() bool {
	return obj.ID != 0
}

func (obj *Product) LoadByID(id int) {
	Db.Preload("Catalog").First(&obj, id)
	Db.Model(&obj).Update("views_count", obj.ViewsCount+1)
}
