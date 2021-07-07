package main

import (
	"github.com/gin-gonic/gin"
	"strconv"
)

func GetCatalog(context *gin.Context) {
	catalogId, _ := strconv.ParseInt(context.Param("catalog_id"), 10, 64)
	var catalog Catalog
	catalog.LoadByID(int(catalogId))
	SetHeaders(context)
	context.JSON(200, gin.H{
		"obj": catalog,
	})
}

func GetAllCatalogs(context *gin.Context) {
	SetHeaders(context)
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
