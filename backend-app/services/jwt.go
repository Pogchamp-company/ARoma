package services

import (
	"fmt"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
)

// JWTService jwt service
type JWTService interface {
	GenerateToken(email string, isUser bool) string
	ValidateToken(token string) (*jwt.Token, error)
}
type authCustomClaims struct {
	Name string `json:"name"`
	User bool   `json:"user"`
	jwt.StandardClaims
}

type jwtServices struct {
	secretKey string
}

// JWTAuthService auth-jwt
func JWTAuthService() *jwtServices {
	return &jwtServices{
		secretKey: getSecretKey(),
	}
}

func getSecretKey() string {
	secret := os.Getenv("SECRET")
	if secret == "" {
		secret = "secret"
	}
	return secret
}

func (service *jwtServices) GenerateToken(email string, isUser bool) string {
	claims := &authCustomClaims{
		email,
		isUser,
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

func (service *jwtServices) ValidateToken(encodedToken string) (*jwt.Token, error) {
	return jwt.Parse(encodedToken, func(token *jwt.Token) (interface{}, error) {
		if _, isvalid := token.Method.(*jwt.SigningMethodHMAC); !isvalid {
			return nil, fmt.Errorf("Invalid token", token.Header["alg"])

		}
		return []byte(service.secretKey), nil
	})

}
