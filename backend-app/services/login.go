package services

import (
	"aroma/dto"
	"aroma/models"
	"net/mail"
)

type LoginService interface {
	LoginUser(email string, password string) bool
}
type loginInformation struct {
	email    string
	password string
}

func StaticLoginService() LoginService {
	return &loginInformation{
		email:    "bikash.dulal@wesionary.team",
		password: "testing",
	}
}
func (info *loginInformation) LoginUser(email string, password string) bool {
	return info.email == email && info.password == password
}

func LoginUser(credentials dto.LoginCredentials) (string, bool) {
	user := models.User{}
	if _, err := mail.ParseAddress(credentials.Login); err == nil {
		models.Db.Where("email = ?", credentials.Login).First(&user)
	} else {
		models.Db.Where("nickname = ?", credentials.Login).First(&user)
	}

	if !user.Bool() {
		return "", false
	}
	if !user.CheckPassword(credentials.Password) {
		return "", false
	}
	return JWTAuthService().GenerateToken(user.Email, true), true
}
