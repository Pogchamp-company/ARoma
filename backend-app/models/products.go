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
	attributes map[string]interface{}) (Product, error) {
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

func MarshalAttributes(attributes map[string]interface{}) (pgtype.JSONB, error) {
	marshalAttrs, err := json.Marshal(attributes)
	if err != nil {
		return pgtype.JSONB{}, err
	}
	return pgtype.JSONB{
		Status: pgtype.Present,
		Bytes:  marshalAttrs,
	}, nil
}

func (obj Product) ToStr() string {
	return obj.Title
}

func (obj Product) ToRepr() string {
	return fmt.Sprintf("<Product (id=%s, title=%s)>", fmt.Sprint(obj.ID), obj.Title)
}

func (obj *Product) FormattedPhotos() map[string]interface{} {
	var apiProduct map[string]interface{}
	res, _ := json.Marshal(obj)
	json.Unmarshal(res, &apiProduct)
	apiProduct["Photos"] = []map[string]interface{}{}
	for _, photo := range obj.Photos {
		apiProduct["Photos"] = append(apiProduct["Photos"].([]map[string]interface{}), map[string]interface{}{
			"ID":  photo.ID,
			"Url": photo.GetUrl(),
		})
	}
	return apiProduct
}

func (obj *Product) LoadByID(id int) {
	Db.Preload("Catalog").Preload("Photos").First(&obj, id)
	Db.Model(&obj).Update("views_count", obj.ViewsCount+1)
}
