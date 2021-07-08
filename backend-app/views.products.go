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

func SearchProducts(context *gin.Context) {
	SetHeaders(context)
	productQuery := context.Request.URL.Query().Get("productQuery")
	var products []Product
	query := Db.Debug().Where("title ILIKE ?", "%"+productQuery+"%")
	catalogId := context.Request.URL.Query().Get("catalogId")
	if catalogId != "" {
		query = query.Where("catalog_id = ?", catalogId)
	}
	query.Preload("Catalog").Find(&products)
	context.JSON(200, gin.H{
		"products": products,
	})
}
