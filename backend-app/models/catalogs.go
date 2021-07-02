package models

type Catalog struct {
	ID    uint   `sql:"AUTO_INCREMENT" gorm:"primary_key"`
	Title string `sql:"size:255;unique" gorm:"not null"`
}
