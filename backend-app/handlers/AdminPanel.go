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
			"errors": "Missing product id",
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

func UpdateCatalogInfo(context *gin.Context) {
	catalogID := context.Request.URL.Query().Get("catalogID")
	if catalogID == "" {
		context.JSON(http.StatusBadRequest, gin.H{
			"errors": "Missing catalog id",
		})
		return
	}
	var c int64
	models.Db.Model(&models.Catalog{}).Where("id = ?", catalogID).Count(&c)
	if c == 0 {
		context.JSON(http.StatusNotFound, gin.H{
			"errors": "This catalog does not exists",
		})
		return
	}
	var credentials dto.UpdateCatalogCredentials
	err := context.ShouldBind(&credentials)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{
			"errors": err,
		})
		return
	}
	models.Db.Model(&models.Catalog{}).Where("id = ?", catalogID).
		Updates(models.Catalog{
			Title: credentials.Title,
		})
	context.JSON(http.StatusOK, gin.H{
		"ok": true,
	})
}

func DeleteRecord(model interface{}, idParam string) gin.HandlerFunc {
	return func(context *gin.Context) {
		objectID := context.Request.URL.Query().Get(idParam)
		if objectID == "" {
			context.JSON(http.StatusBadRequest, gin.H{
				"errors": "Missing id",
			})
			return
		}
		err := models.Db.Delete(model, objectID).Error
		if err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{
				"errors": "Error when trying delete record",
			})
			return
		}
		context.JSON(http.StatusOK, gin.H{
			"ok": true,
		})
	}
}
