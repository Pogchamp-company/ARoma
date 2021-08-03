package services

import (
	"aroma/dto"
	"aroma/models"
)

func LoginUser(credentials dto.LoginCredentials) (string, bool) {
	user := models.User{}
	models.Db.Where("email = ? OR nickname = ?", credentials.Login, credentials.Login).First(&user)

	if !user.Bool() {
		return "", false
	}
	if !user.CheckPassword(credentials.Password) {
		return "", false
	}
	return JWTAuthService().GenerateToken(user.Email, true), true
}
