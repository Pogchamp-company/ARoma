package main

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"strconv"
	"strings"
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

func searchInMapsArray(arr []map[string]interface{}, key string, value interface{}) (map[string]interface{}, bool) {
	for _, map_ := range arr {
		if map_[key] == value {
			return map_, true
		}
	}
	return nil, false
}

func GetAttributes(context *gin.Context) {
	catalogId := context.Request.URL.Query().Get("catalogId")
	var rawAttributes []string
	Db.Model(&Product{}).Where("catalog_id = ?", catalogId).Pluck("attributes", &rawAttributes)
	var attributesArray []map[string]interface{}
	json.Unmarshal([]byte("["+strings.Join(rawAttributes[:], ",")+"]"), &attributesArray)
	var response []map[string]interface{}
	var attributeMap map[string]interface{}
	if len(attributesArray) > 0 {
		for key, _ := range attributesArray[0] {
			attributeMap = map[string]interface{}{
				"Title": key,
			}
			response = append(response, attributeMap)
			for _, attributes := range attributesArray {
				value := attributes[key]
				switch value.(type) {
				case string:
					if old, ok := attributeMap["Values"]; ok {
						if Map, ok := searchInMapsArray(old.([]map[string]interface{}), "Title", value); ok {
							count := Map["Count"].(int)
							count++
							Map["Count"] = count
						} else {
							attributeMap["Values"] = append(attributeMap["Values"].([]map[string]interface{}), map[string]interface{}{
								"Title": value,
								"Count": 1,
							})
						}
					} else {
						attributeMap["Values"] = []map[string]interface{}{{
							"Title": value,
							"Count": 1,
						}}
					}
				case int, int16, int32, int64, float32, float64:
					if oldValue, ok := attributeMap["MinValue"]; ok {
						if oldValue.(float64) > value.(float64) {
							attributeMap["MinValue"] = value
						}
					}
					if oldValue, ok := attributeMap["MaxValue"]; ok {
						if oldValue.(float64) < value.(float64) {
							attributeMap["MaxValue"] = value
						}
					} else {
						attributeMap["MinValue"] = value
						attributeMap["MaxValue"] = value
					}
				}
			}

		}
	}
	context.JSON(200, gin.H{
		"attributes": response,
	})
}
