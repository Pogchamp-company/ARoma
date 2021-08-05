package models

import (
	"fmt"
)

type Model interface {
	ToStr() string
	ToRepr() string
	ToBool() bool
	LoadByID(id int)
}

type BaseModel struct {
	ID int
}

//func (obj BaseModel) TableName() string {
//	return reflect.TypeOf(obj).String()
//}

func (obj BaseModel) ToStr() string {
	return string(rune(obj.ID))
}

func (obj BaseModel) ToRepr() string {
	return fmt.Sprintf("<%s (id=%s)>", "Plug", fmt.Sprint(obj.ID))
}

func (obj BaseModel) ToBool() bool {
	return obj.ID != 0
}
