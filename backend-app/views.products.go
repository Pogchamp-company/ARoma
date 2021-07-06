package main

import (
	"github.com/gin-gonic/gin"
	"strconv"
)

func GetProduct(context *gin.Context) {
	productId, _ := strconv.ParseInt(context.Param("product_id"), 10, 64)
	var product Product
	product.LoadByID(int(productId))
	SetHeaders(context)
	context.JSON(200, gin.H{
		"obj": product,
	})
}
