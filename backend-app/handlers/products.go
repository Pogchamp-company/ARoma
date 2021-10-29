package handlers

import (
	"aroma/config"
	"aroma/models"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/mitchellh/mapstructure"
	"gorm.io/gorm"
	"net/http"
	"strconv"
)

func GetProduct(context *gin.Context) {
	productId, err := strconv.ParseInt(context.Param("product_id"), 10, 64)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{
			"errors": "Invalid id",
		})
	}
	var product models.Product
	product.LoadByID(int(productId))
	context.JSON(http.StatusOK, gin.H{
		"obj": product.FormattedPhotos(),
	})
}

type NumberRange struct {
	Min float32
	Max float32
}
type FilterAttribute struct {
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

func filterProductsByNumberAttribute(query *gorm.DB, attribute FilterAttribute) {
	var Value NumberRange
	err := mapstructure.Decode(attribute.Value, &Value)
	if err == nil {
		query.Where("cast(attributes->>? as float) BETWEEN ? AND ?", attribute.Title, Value.Min, Value.Max)
	}
}

func filterProductsByExtraAttribute(query *gorm.DB, attribute FilterAttribute) {
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
		var attribute FilterAttribute
		err := mapstructure.Decode(rawAttribute, &attribute)
		if err != nil {
			continue
		}
		filterProductsByExtraAttribute(query, attribute)
	}
}

func SearchProducts(context *gin.Context) {
	page := context.Request.URL.Query().Get("page")
	if page == "" {
		page = "1"
	}
	thisPage, _ := strconv.ParseInt(page, 10, 64)
	productQuery := context.Request.URL.Query().Get("productQuery")
	var products []models.Product
	query := models.Db.Model(&models.Product{}).Where("title ILIKE ?", "%"+productQuery+"%")
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
	ProductsPageLimit := int64(config.Config.ProductsPageLimit)
	var count int64
	query.Count(&count)
	pagesCount := count / ProductsPageLimit
	if count%ProductsPageLimit != 0 {
		pagesCount += 1
	}
	query.Preload("Catalog").Preload("Photos").
		Offset(int(ProductsPageLimit * (thisPage - 1))).Limit(int(ProductsPageLimit)).
		Order("id asc").
		Find(&products)
	apiProducts := []map[string]interface{}{}
	for _, product := range products {
		apiProducts = append(apiProducts, product.FormattedPhotos())
	}
	context.JSON(http.StatusOK, gin.H{
		"products":   apiProducts,
		"pagesCount": pagesCount,
	})
}

func TopProducts(context *gin.Context) {
	var products []models.Product
	models.Db.Preload("Catalog").Preload("Photos").
		Order("views_count desc").Limit(12).Find(&products)
	var apiProducts []map[string]interface{}
	for _, product := range products {
		apiProducts = append(apiProducts, product.FormattedPhotos())
	}
	context.JSON(http.StatusOK, gin.H{
		"products": apiProducts,
	})
}
