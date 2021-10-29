package services

import (
	"aroma/dto"
	"aroma/models"
)

func RegisterUser(credentials dto.RegisterCredentials) (string, bool) {
	user, err := models.NewUser(credentials.Email, credentials.Password, credentials.Nickname)

	if err != nil {
		return "", false
	}
	return JWTAuthService().GenerateToken(user.Email), true
}
