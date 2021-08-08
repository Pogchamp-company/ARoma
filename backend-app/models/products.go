package models

import (
	"encoding/json"
	"fmt"
	"github.com/jackc/pgtype"
)

type Product struct {
	BaseModel
	Title           string
	CatalogID       int
	Catalog         Catalog
	Price           float32
	QuantityInStock int
	Description     string
	LongDescription string
	Attributes      pgtype.JSONB
	ViewsCount      int
	Photos          []Attachment `gorm:"many2many:product_attachment"`
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
	query := Db.Create(&product)
	return product, query.Error
}

func (obj Product) ToStr() string {
	return obj.Title
}

func (obj Product) ToRepr() string {
	return fmt.Sprintf("<Product (id=%s, title=%s)>", fmt.Sprint(obj.ID), obj.Title)
}

func (obj *Product) LoadByID(id int) {
	Db.Preload("Catalog").First(&obj, id)
	Db.Model(&obj).Update("views_count", obj.ViewsCount+1)
}
