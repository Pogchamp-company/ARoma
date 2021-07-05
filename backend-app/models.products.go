package main

import (
	"encoding/json"
	"fmt"
	"github.com/jackc/pgtype"
)

type Product struct {
	ID              int     `sql:"AUTO_INCREMENT" gorm:"primary_key"`
	Title           string  `sql:"size:255" gorm:"not null"`
	CatalogID       int     `gorm:"column:catalog_id;not null"`
	Catalog         Catalog `gorm:"ForeignKey:CatalogID"`
	Price           float64 `gorm:"not null"`
	Description     string  `sql:"size:1024" gorm:"not null"`
	LongDescription string  `gorm:"not null"`
	Attributes      pgtype.JSON
}

func NewProduct(title string, catalog Catalog, attributes map[string]string) (Product, error) {
	marshalAttrs, err := json.Marshal(attributes)
	if err != nil {
		return Product{}, err
	}
	product := Product{
		Title:   title,
		Catalog: catalog,
		Attributes: pgtype.JSON{
			Status: pgtype.Present,
			Bytes:  marshalAttrs,
		},
	}
	Db.Create(&product)
	return product, nil
}

func (product Product) ToString() string {
	return product.Title
}

func (product Product) Repr() string {
	return fmt.Sprintf("<Product (id=%s, title=%s)>", fmt.Sprint(product.ID), product.Title)
}
