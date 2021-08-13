package handlers

import (
	"aroma/dto"
	"aroma/models"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgtype"
	"net/http"
	"strconv"
)

func validateAttributes(marshaledAttributes string) bool {
	var attributes map[string]interface{}
	err := json.Unmarshal([]byte(marshaledAttributes), &attributes)
	if err != nil {
		return false
	}
	for _, attribute := range attributes {
		switch attribute.(type) {
		case string:
		case int, int8, int16, int32, int64, float32, float64:
		default:
			return false
		}
	}
	return true
}

func UpdateProductInfo(context *gin.Context) {
	productID := context.Request.URL.Query().Get("productID")
	_, err := strconv.ParseInt(productID, 10, 64)
	if productID != "" && err != nil {
		context.JSON(http.StatusBadRequest, gin.H{
			"errors": "Incorrect product id",
		})
		return
	}
	var c int64
	models.Db.Model(&models.Product{}).Where("id = ?", productID).Count(&c)
	if c == 0 && productID == "" {
		context.JSON(http.StatusNotFound, gin.H{
			"errors": "This product does not exists",
		})
		return
	}
	var credentials dto.UpdateProductCredentials
	err = context.ShouldBind(&credentials)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{
			"errors": err,
		})
		return
	}
	ok := validateAttributes(credentials.Attributes)
	if !ok {
		context.JSON(http.StatusBadRequest, gin.H{
			"errors": "Invalid attributes",
		})
		return
	}
	if productID != "" {
		err = models.Db.Model(&models.Product{}).Where("id = ?", productID).
			Updates(models.Product{
				Title:           credentials.Title,
				Price:           credentials.Price,
				Description:     credentials.Description,
				LongDescription: credentials.LongDescription,
				QuantityInStock: credentials.QuantityInStock,
				Attributes: pgtype.JSONB{
					Status: pgtype.Present,
					Bytes:  []byte(credentials.Attributes),
				},
			}).Error
	} else {
		catalogID := context.Request.URL.Query().Get("catalogID")
		var catalog models.Catalog
		err = models.Db.First(&catalog, catalogID).Error
		if err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{
				"ok": false,
			})
			return
		}
		var attributes map[string]interface{}
		_ = json.Unmarshal([]byte(credentials.Attributes), &attributes)
		_, err = models.NewProduct(credentials.Title,
			catalog,
			credentials.Price,
			credentials.QuantityInStock,
			credentials.Description,
			credentials.LongDescription,
			map[string]interface{}{},
		)
	}
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{
			"ok": false,
		})
	} else {
		context.JSON(http.StatusOK, gin.H{
			"ok": true,
		})
	}
}

func UpdateCatalogInfo(context *gin.Context) {
	catalogID := context.Request.URL.Query().Get("catalogID")
	var c int64
	models.Db.Model(&models.Catalog{}).Where("id = ?", catalogID).Count(&c)
	if c == 0 && catalogID != "" {
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
	if catalogID != "" {
		models.Db.Model(&models.Catalog{}).Where("id = ?", catalogID).
			Updates(models.Catalog{
				Title: credentials.Title,
			})
	} else {
		catalog, err := models.NewCatalog(credentials.Title)
		if err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{
				"errors": "Error when trying delete record",
			})
			return
		}
		catalogID = strconv.Itoa(catalog.ID)
	}
	context.JSON(http.StatusOK, gin.H{
		"ok": true,
		"ID": catalogID,
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
