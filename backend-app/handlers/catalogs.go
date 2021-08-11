package handlers

import (
	"aroma/models"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/mitchellh/mapstructure"
	"net/http"
	"strconv"
	"strings"
)

func GetCatalog(context *gin.Context) {
	catalogId, _ := strconv.ParseInt(context.Param("catalog_id"), 10, 64)
	var catalog models.Catalog
	catalog.LoadByID(int(catalogId))
	context.JSON(http.StatusOK, gin.H{
		"obj": catalog,
	})
}

func GetAllCatalogs(context *gin.Context) {
	var catalogs []models.Catalog
	models.Db.Order("id asc").Find(&catalogs)
	var response []map[string]interface{}
	var count int64 = 0
	for _, catalog := range catalogs {
		models.Db.Model(&models.Product{}).Where("catalog_id = ?", catalog.ID).Count(&count)
		response = append(response, map[string]interface{}{
			"ID":    catalog.ID,
			"Title": catalog.Title,
			"Count": int(count),
		})
	}
	context.JSON(http.StatusOK, gin.H{
		"catalogs": response,
	})
}

type Attribute struct {
	Title string
	Type  string
	Value interface{}
}
type StringValue struct {
	Title string
	Count int
}

func searchInStringValuesArray(arr []StringValue, title string) (StringValue, bool) {
	for _, stringValue := range arr {
		if stringValue.Title == title {
			return stringValue, true
		}
	}
	return StringValue{}, false
}

func updateStringAttributeValue(attribute *Attribute, value string) {
	var oldValue []StringValue
	err := mapstructure.Decode(attribute.Value, &oldValue)
	if err != nil {
		return
	}
	if stringValue, ok := searchInStringValuesArray(oldValue, value); ok {
		stringValue.Count += 1
	} else {
		oldValue = append(oldValue, StringValue{
			Title: value,
			Count: 1,
		})
	}
	attribute.Value = oldValue
}

func updateNumberAttributeValue(attribute *Attribute, value float32) {
	var oldValue NumberRange
	err := mapstructure.Decode(attribute.Value, &oldValue)
	if err != nil {
		return
	}
	if oldValue.Min == 0 && oldValue.Max == 0 {
		oldValue.Min = value
		oldValue.Max = value
	} else if oldValue.Max < value {
		oldValue.Max = value
	} else if oldValue.Min > value {
		oldValue.Min = value
	}
	attribute.Value = oldValue
}

func updateAttributeValue(attributesArray []map[string]interface{}, attribute *Attribute) {
	for _, attributes := range attributesArray {
		value := attributes[attribute.Title]
		switch attribute.Type {
		case "string":
			updateStringAttributeValue(attribute, value.(string))
		case "number":
			updateNumberAttributeValue(attribute, float32(value.(float64)))
		}
	}
}

func getAttributes(attributesArray []map[string]interface{}) []Attribute {
	var response []Attribute
	var attribute Attribute
	for key, v := range attributesArray[0] {
		attribute = Attribute{
			Title: key,
		}
		switch v.(type) {
		case string:
			attribute.Type = "string"
		default:
			attribute.Type = "number"
		}
		updateAttributeValue(attributesArray, &attribute)
		response = append(response, attribute)
	}
	return response
}

func getPrice(catalogId string) NumberRange {
	var minPrice, maxPrice float32
	minQuery := models.Db.Model(&models.Product{})
	maxQuery := models.Db.Model(&models.Product{})
	if catalogId != "" {
		minQuery = minQuery.Where("catalog_id = ?", catalogId)
		maxQuery = maxQuery.Where("catalog_id = ?", catalogId)
	}
	minQuery.Pluck("MIN(price)", &minPrice)
	maxQuery.Pluck("MAX(price)", &maxPrice)
	return NumberRange{
		Min: minPrice,
		Max: maxPrice,
	}
}

func GetAttributes(context *gin.Context) {
	catalogId := context.Request.URL.Query().Get("catalogId")
	var rawAttributes []string
	models.Db.Model(&models.Product{}).Where("catalog_id = ?", catalogId).Pluck("attributes", &rawAttributes)
	var attributesArray []map[string]interface{}
	json.Unmarshal([]byte("["+strings.Join(rawAttributes[:], ",")+"]"), &attributesArray)
	attributes := []Attribute{}
	if len(attributesArray) > 0 {
		attributes = getAttributes(attributesArray)
	}

	context.JSON(http.StatusOK, gin.H{
		"attributes": attributes,
		"price":      getPrice(catalogId),
	})
}
