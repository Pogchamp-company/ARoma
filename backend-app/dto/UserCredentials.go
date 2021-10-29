package dto

type RegisterCredentials struct {
	Email    string `form:"email" validate:"required"`
	Nickname string `form:"nickname" validate:"required"`
	Password string `form:"password" validate:"required"`
}

type LoginCredentials struct {
	Login    string `form:"login" validate:"required"`
	Password string `form:"password" validate:"required"`
}
