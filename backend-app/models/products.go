package models

import "github.com/jackc/pgtype"

type Product struct {
	ID         uint    `sql:"AUTO_INCREMENT" gorm:"primary_key"`
	Title      string  `sql:"size:255" gorm:"not null"`
	CatalogID  int     `gorm:"column:catalog_id;not null"`
	Catalog    Catalog `gorm:"foreignKey:CatalogID"`
	Attributes pgtype.JSON
}
