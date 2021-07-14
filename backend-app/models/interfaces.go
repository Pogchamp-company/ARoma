package models

type Model interface {
	Str() string
	Repr() string
	Bool() bool
	LoadByID(id int)
}
