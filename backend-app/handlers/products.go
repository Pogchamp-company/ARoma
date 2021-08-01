package handlers

import (
	"aroma/models"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/mitchellh/mapstructure"
	"gorm.io/gorm"
	"net/http"
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

type NumberRange struct {
	Min float32
	Max float32
}
type Attribute struct {
	Title string
	Type  string
	Value interface{}
}

func filterProductsByPrice(query *gorm.DB, rawPrice interface{}) {
	var price NumberRange
	err := mapstructure.Decode(rawPrice, &price)
	if err == nil {
		query.Where("price BETWEEN ? AND ?", price.Min, price.Max)
	}
}

func filterProductsByNumberAttribute(query *gorm.DB, attribute Attribute) {
	var Value NumberRange
	err := mapstructure.Decode(attribute.Value, &Value)
	if err == nil {
		query.Where("cast(attributes->>? as float) BETWEEN ? AND ?", attribute.Title, Value.Min, Value.Max)
	}
}

func filterProductsByExtraAttribute(query *gorm.DB, attribute Attribute) {
	switch attribute.Type {
	case "string":
		query.Where("attributes->>? = ?", attribute.Title, attribute.Value)
	case "number":
		filterProductsByNumberAttribute(query, attribute)
	}
}

func filterProductsByAttributes(query *gorm.DB, filters map[string]interface{}) {
	if rawPrice, ok := filters["price"]; ok {
		filterProductsByPrice(query, rawPrice)
	}
	var attributes interface{}
	var ok bool
	if attributes, ok = filters["attributes"]; !ok {
		return
	}
	for _, rawAttribute := range attributes.([]interface{}) {
		var attribute Attribute
		err := mapstructure.Decode(rawAttribute, &attribute)
		if err != nil {
			continue
		}
		filterProductsByExtraAttribute(query, attribute)
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

func TestLoginRequired(context *gin.Context) {
	context.JSON(http.StatusOK, gin.H{
		"ok": true,
	})
}
