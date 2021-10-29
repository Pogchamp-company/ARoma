package models

import (
	"fmt"
)

type Catalog struct {
	BaseModel
	Title    string
	Products []Product
}

func NewCatalog(title string) (Catalog, error) {
	catalog := Catalog{
		Title: title,
	}
	query := Db.Create(&catalog)
	return catalog, query.Error
}

func (obj Catalog) Str() string {
	return obj.Title
}

func (obj Catalog) Repr() string {
	return fmt.Sprintf("<Catalog (id=%s, title=%s)>", fmt.Sprint(obj.ID), obj.Title)
}

func (obj *Catalog) LoadByID(id int) {
	Db.Preload("Products").First(&obj, id)
}
