package dto

type UpdateProductCredentials struct {
	Title           string  `form:"Title" validate:"required"`
	Price           float32 `form:"Price" validate:"required"`
	Description     string  `form:"Description" validate:"required"`
	LongDescription string  `form:"LongDescription" validate:"required"`
	QuantityInStock int     `form:"QuantityInStock" validate:"required"`
}
