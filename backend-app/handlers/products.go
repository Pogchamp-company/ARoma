package handlers

import (
	"aroma/models"
	"github.com/gin-gonic/gin"
	"strconv"
)

func GetProduct(context *gin.Context) {
	productId, _ := strconv.ParseInt(context.Param("product_id"), 10, 64)
	var product models.Product
	product.LoadByID(int(productId))
	context.JSON(200, gin.H{
		"obj": product,
	})
}

func SearchProducts(context *gin.Context) {
	productQuery := context.Request.URL.Query().Get("productQuery")
	var products []models.Product
	query := models.Db.Where("title ILIKE ?", "%"+productQuery+"%")
	catalogId := context.Request.URL.Query().Get("catalogId")
	if catalogId != "" {
		query = query.Where("catalog_id = ?", catalogId)
	}
	query.Preload("Catalog").Find(&products)
	context.JSON(200, gin.H{
		"products": products,
	})
}

func TopProducts(context *gin.Context) {
	var products []models.Product
	models.Db.Preload("Catalog").Limit(12).Find(&products)
	context.JSON(200, gin.H{
		"products": products,
	})
}
