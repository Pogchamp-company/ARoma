package dto

type OrderDetailsCredentials struct {
	FirstName   string `form:"first" validate:"required"`
	LastName    string `form:"last" validate:"required"`
	PhoneNumber string `form:"phoneNumber" validate:"required"`
	Country     string `form:"country" validate:"required"`
	City        string `form:"city" validate:"required"`
	Route       string `form:"route" validate:"required"`
	ZipCode     string `form:"zip" validate:"required"`
	ExtraInfo   string `form:"message" validate:"required"`
}
