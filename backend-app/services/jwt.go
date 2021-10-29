package services

import (
	"aroma/config"
	"fmt"
	"time"

	"github.com/dgrijalva/jwt-go"
)

type JWTService interface {
	GenerateToken(email string) string
	ValidateToken(token string) (*jwt.Token, error)
}

type authClaims struct {
	Email string
	jwt.StandardClaims
}

type jwtService struct {
	secretKey string
}

func JWTAuthService() *jwtService {
	return &jwtService{
		secretKey: config.Config.JWTSecretKey,
	}
}

func (service *jwtService) GenerateToken(email string) string {
	claims := &authClaims{
		email,
		jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * 48).Unix(),
			IssuedAt:  time.Now().Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	//encoded string
	t, err := token.SignedString([]byte(service.secretKey))
	if err != nil {
		panic(err)
	}
	return t
}

func (service *jwtService) ValidateToken(encodedToken string) (*jwt.Token, error) {
	return jwt.Parse(encodedToken, func(token *jwt.Token) (interface{}, error) {
		if _, isValid := token.Method.(*jwt.SigningMethodHMAC); isValid {
			return []byte(service.secretKey), nil

		}
		return nil, fmt.Errorf("Invalid token", token.Header["alg"])
	})

}
