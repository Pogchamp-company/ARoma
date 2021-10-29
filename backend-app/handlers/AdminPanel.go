package handlers

import (
	"aroma/dto"
	"aroma/models"
	"aroma/services/attachments"
	"encoding/json"
	"fmt"
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
	if c == 0 && productID != "" {
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
	var product models.Product
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
		id, _ := strconv.ParseInt(productID, 10, 64)
		product.ID = int(id)
	} else {
		catalogID := context.Request.URL.Query().Get("catalogID")
		if catalogID == "" {
			context.JSON(http.StatusInternalServerError, gin.H{
				"errors": "Missing catalog id",
			})
			return
		}
		var catalog models.Catalog
		models.Db.First(&catalog, catalogID)
		if !catalog.ToBool() {
			context.JSON(http.StatusNotFound, gin.H{
				"ok": false,
			})
			return
		}
		var attributes map[string]interface{}
		_ = json.Unmarshal([]byte(credentials.Attributes), &attributes)
		product, err = models.NewProduct(credentials.Title,
			catalog,
			credentials.Price,
			credentials.QuantityInStock,
			credentials.Description,
			credentials.LongDescription,
			attributes,
		)
	}
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{
			"ok": false,
		})
	} else {
		context.JSON(http.StatusOK, gin.H{
			"ok":        true,
			"productID": product.ID,
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

func UploadProductPhoto(context *gin.Context) {
	productID := context.Request.URL.Query().Get("productID")
	var product models.Product
	models.Db.First(&product, productID)
	if !product.ToBool() {
		context.AbortWithStatus(http.StatusBadRequest)
		return
	}
	file, err := context.FormFile("photo")
	if err != nil {
		context.AbortWithStatus(http.StatusBadRequest)
		return
	}
	minioManager := attachments.InitAttachmentManager("product-photos")
	attachment, err := minioManager.Upload(file)
	if err != nil {
		fmt.Println(err)
		context.AbortWithStatus(http.StatusInternalServerError)
		return
	}
	err = models.Db.Exec("INSERT INTO product_attachment VALUES (?, ?)", productID, attachment.ID).Error

	context.JSON(http.StatusOK, gin.H{
		"attachmentID":  attachment.ID,
		"attachmentURL": attachment.GetUrl(),
	})
}

func DeleteProductPhoto(context *gin.Context) {
	productID := context.Request.URL.Query().Get("productID")
	attachmentID := context.Request.URL.Query().Get("attachmentID")
	if productID == "" || attachmentID == "" {
		context.AbortWithStatus(http.StatusBadRequest)
		return
	}
	err := models.Db.Exec("DELETE FROM product_attachment WHERE product_id = ? AND attachment_id = ?", productID, attachmentID).Error
	if err != nil {
		context.AbortWithStatus(http.StatusInternalServerError)
		return
	}
	models.Db.Delete(&models.Attachment{}, attachmentID)
	context.JSON(http.StatusOK, gin.H{
		"status": "ok",
	})
}

func UpdateOrderTrackingNumber(context *gin.Context) {
	orderID, err := strconv.ParseInt(context.Request.URL.Query().Get("orderID"), 10, 64)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{
			"errors": "Incorrect id",
		})
		return
	}
	trackingNumber := context.Request.URL.Query().Get("trackingNumber")
	if trackingNumber == "" {
		context.JSON(http.StatusBadRequest, gin.H{
			"errors": "Tracking number required",
		})
		return
	}
	var count int64
	models.Db.Model(&models.Order{}).Where("id = ?", orderID).Count(&count)
	if count == 0 {
		context.JSON(http.StatusNotFound, gin.H{
			"errors": "Order not found",
		})
		return
	}
	err = models.Db.Model(&models.OrderDetails{}).Where("order_id = ?", orderID).Update("tracking_number", trackingNumber).Error
	err = models.Db.Model(&models.Order{}).Where("id = ?", orderID).Update("status", "SHIPMENT").Error
	if err != nil {
		context.AbortWithStatus(http.StatusInternalServerError)
		return
	}
	context.JSON(http.StatusOK, gin.H{
		"ok": true,
	})
}

func UpdateOrderStatus(status models.OrderStatus) gin.HandlerFunc {
	return func(context *gin.Context) {
		orderID, err := strconv.ParseInt(context.Request.URL.Query().Get("orderID"), 10, 64)
		if err != nil {
			context.JSON(http.StatusBadRequest, gin.H{
				"errors": "Incorrect id",
			})
			return
		}
		var count int64
		models.Db.Model(&models.Order{}).Where("id = ?", orderID).Count(&count)
		if count == 0 {
			context.JSON(http.StatusNotFound, gin.H{
				"errors": "Order not found",
			})
			return
		}
		err = models.Db.Model(&models.Order{}).Where("id = ?", orderID).Update("status", status).Error
		if err != nil {
			context.AbortWithStatus(http.StatusInternalServerError)
			return
		}
		context.JSON(http.StatusOK, gin.H{
			"ok": true,
		})
	}
}
