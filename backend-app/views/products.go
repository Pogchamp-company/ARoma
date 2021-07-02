package views

import "github.com/gin-gonic/gin"
import "../models"
import "strconv"

func GetProduct(context *gin.Context) {
	productId, _ := strconv.ParseInt(context.Param("product_id"), 10, 64)
	var product models.Product
	models.Db.First(&product, productId)
	context.JSON(200, gin.H{
		"body": product,
	})
}
