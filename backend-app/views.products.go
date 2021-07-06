package main

import (
	"github.com/gin-gonic/gin"
	"strconv"
)

func GetProduct(context *gin.Context) {
	productId, _ := strconv.ParseInt(context.Param("product_id"), 10, 64)
	var product Product
	Db.Preload("Catalog").First(&product, productId)
	println(product.Repr())
	context.Header("Access-Control-Allow-Origin", "http://localhost:8000")
	context.Header("Access-Control-Allow-Headers", "Content-Type, X-Auth-Token, Authorization, Origin")
	context.Header("Access-Control-Allow-Methods", "POST, PUT")

	context.JSON(200, gin.H{
		"object": product,
	})
}
