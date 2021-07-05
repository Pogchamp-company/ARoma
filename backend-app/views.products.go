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
	context.JSON(200, gin.H{
		"product": product,
	})
}
