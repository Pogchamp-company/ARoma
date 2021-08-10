package handlers

import (
	"aroma/dto"
	"aroma/models"
	"github.com/gin-gonic/gin"
	"net/http"
)

func UpdateProductInfo(context *gin.Context) {
	productID := context.Request.URL.Query().Get("productID")
	if productID == "" {
		context.JSON(http.StatusBadRequest, gin.H{
			"errors": "Incorrect product id",
		})
		return
	}
	var c int64
	models.Db.Model(&models.Product{}).Where("id = ?", productID).Count(&c)
	if c == 0 {
		context.JSON(http.StatusNotFound, gin.H{
			"errors": "This product does not exists",
		})
		return
	}
	var credentials dto.UpdateProductCredentials
	err := context.ShouldBind(&credentials)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{
			"errors": err,
		})
		return
	}
	models.Db.Model(&models.Product{}).Where("id = ?", productID).
		Updates(models.Product{
			Title:           credentials.Title,
			Price:           credentials.Price,
			Description:     credentials.Description,
			LongDescription: credentials.LongDescription,
			QuantityInStock: credentials.QuantityInStock,
		})
	context.JSON(http.StatusOK, gin.H{
		"ok": true,
	})
}
