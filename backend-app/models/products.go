package models

import (
	"encoding/json"
	"fmt"
	"github.com/jackc/pgtype"
)

type Product struct {
	ID              int
	Title           string
	CatalogID       int     `gorm:"column:catalog_id"`
	Catalog         Catalog `gorm:"ForeignKey:CatalogID"`
	Price           float64
	Description     string
	LongDescription string
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
}
