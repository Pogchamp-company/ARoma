package main

type Catalog struct {
	ID       int       `sql:"AUTO_INCREMENT" gorm:"primary_key"`
	Title    string    `sql:"size:255;unique" gorm:"not null"`
	Products []Product `gorm:"ForeignKey:CatalogID"`
}
