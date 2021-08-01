package dto

type RegisterCredentials struct {
	Email    string `form:"email"`
	Nickname string `form:"nickname"`
	Password string `form:"password"`
}

type LoginCredentials struct {
	Login    string `form:"login"`
	Password string `form:"password"`
}
