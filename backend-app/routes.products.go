package main

import (
	"github.com/gin-gonic/gin"
	"strconv"
)

var App = gin.Default()

func GetProduct(context *gin.Context) {
	productId, _ := strconv.ParseInt(context.Param("product_id"), 10, 64)
	var product Product
	Db.First(&product, productId)
	//println("Fuck you,", product.Catalog.ID)
	context.JSON(200, gin.H{
		"body": product,
	})
}

func Ping(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "pong",
	})
}

func InitRoutes() {
	App.GET("/ping", Ping)
	App.GET("/product/:product_id", GetProduct)
}
