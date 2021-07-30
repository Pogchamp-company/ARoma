package handlers

import (
	"aroma/models"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
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

func filterProductsByAttributes(query *gorm.DB, filters map[string]interface{}) {
	if price, ok := filters["price"]; ok {
		query.Where("price >= ?", price.(map[string]interface{})["Min"])
		query.Where("price <= ?", price.(map[string]interface{})["Max"])
	}
	if attributes, ok := filters["attributes"]; ok {
		attributes := attributes.([]interface{})
		for _, attribute := range attributes {
			attribute := attribute.(map[string]interface{})
			switch attribute["Type"] {
			case "string":
				query.Where("attributes->>? = ?", attribute["Title"], attribute["Value"])
			case "number":
				query.Where("attributes->>? >= ?", attribute["Title"], attribute["Value"].(map[string]interface{})["Min"])
				query.Where("attributes->>? <= ?", attribute["Title"], attribute["Value"].(map[string]interface{})["Max"])
			}
		}
	}
}

func SearchProducts(context *gin.Context) {
	productQuery := context.Request.URL.Query().Get("productQuery")
	var products []models.Product
	query := models.Db.Where("title ILIKE ?", "%"+productQuery+"%")
	catalogId := context.Request.URL.Query().Get("catalogId")
	if catalogId != "" {
		query = query.Where("catalog_id = ?", catalogId)
	}
	rawFilters := context.Request.URL.Query().Get("filters")
	var filters map[string]interface{}
	err := json.Unmarshal([]byte(rawFilters), &filters)
	if err == nil {
		filterProductsByAttributes(query, filters)
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
