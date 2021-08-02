package models

import (
	"fmt"
)

type Catalog struct {
	ID       int
	Title    string
	Products []Product
}

func NewCatalog(title string) (Catalog, error) {
	catalog := Catalog{
		Title: title,
	}
	Db.Create(&catalog)
	return catalog, nil
}

func (obj Catalog) Str() string {
	return obj.Title
}

func (obj Catalog) Repr() string {
	return fmt.Sprintf("<Catalog (id=%s, title=%s)>", fmt.Sprint(obj.ID), obj.Title)
}

func (obj Catalog) Bool() bool {
	return obj.ID != 0
}

func (obj *Catalog) LoadByID(id int) {
	Db.Preload("Products").First(&obj, id)
}
