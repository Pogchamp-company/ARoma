package main

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"strconv"
	"strings"
)

func GetCatalog(context *gin.Context) {
	catalogId, _ := strconv.ParseInt(context.Param("catalog_id"), 10, 64)
	var catalog Catalog
	catalog.LoadByID(int(catalogId))
	context.JSON(200, gin.H{
		"obj": catalog,
	})
}

func GetAllCatalogs(context *gin.Context) {
	var catalogs []Catalog
	Db.Find(&catalogs)
	var response []map[string]interface{}
	var count int64 = 0
	for _, catalog := range catalogs {
		Db.Model(&Product{}).Where("catalog_id = ?", catalog.ID).Count(&count)
		response = append(response, map[string]interface{}{
			"ID":    catalog.ID,
			"Title": catalog.Title,
			"Count": int(count),
		})
	}
	context.JSON(200, gin.H{
		"catalogs": response,
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
	response := []map[string]interface{}{}
	var attributeMap map[string]interface{}
	if len(attributesArray) > 0 {
		for key, v := range attributesArray[0] {
			attributeMap = map[string]interface{}{
				"Title": key,
			}
			switch v.(type) {
			case string:
				attributeMap["Type"] = "string"
			default:
				attributeMap["Type"] = "number"
			}
			response = append(response, attributeMap)
			for _, attributes := range attributesArray {
				value := attributes[key]
				switch value.(type) {
				case string:
					if old, ok := attributeMap["Values"]; ok {
						if Map, ok := searchInMapsArray(old.([]map[string]interface{}), "Title", value); ok {
							count := Map["Count"].(int)
							Map["Count"] = count + 1
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
