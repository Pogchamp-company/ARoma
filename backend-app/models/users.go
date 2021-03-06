package models

import (
	"aroma/utils"
	"errors"
	"fmt"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	BaseModel
	Email          string
	HashedPassword string
	Nickname       string
	IsAdmin        bool
}

func checkUserExists(email string, nickname string) bool {
	user := User{}
	Db.Where("email = ? OR nickname = ?", email, nickname).First(&user)
	return user.ToBool()
}

func NewUser(email string, password string, nickname string) (User, error) {
	if !utils.ValidateEmail(email) {
		return User{}, errors.New("Not valid email")
	}
	if checkUserExists(email, nickname) {
		return User{}, errors.New("User exists")
	}
	user := User{
		Email:    email,
		Nickname: nickname,
	}
	err := user.SetPassword(password)
	if err != nil {
		return User{}, err
	}
	query := Db.Create(&user)
	return user, query.Error
}

func (obj User) CheckPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(obj.HashedPassword), []byte(password))
	return err == nil
}

func (obj *User) SetPassword(password string) error {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		return err
	}
	obj.HashedPassword = string(bytes)
	return nil
}

func (obj User) ToStr() string {
	return obj.Nickname
}

func (obj User) ToRepr() string {
	return fmt.Sprintf("<User (id=%s, nickname=%s)>", fmt.Sprint(obj.ID), obj.Nickname)
}

func (obj *User) LoadByID(id int) {
	Db.First(&obj, id)
}
