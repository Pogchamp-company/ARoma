package main

import (
	"github.com/gin-gonic/gin"
	"strconv"
)

func GetCatalog(context *gin.Context) {
	catalogId, _ := strconv.ParseInt(context.Param("catalog_id"), 10, 64)
	var catalog Catalog
	Db.Preload("Products").First(&catalog, catalogId)
	context.Header("Access-Control-Allow-Origin", "http://localhost:8000")
	context.Header("Access-Control-Allow-Headers", "Content-Type, X-Auth-Token, Authorization, Origin")
	context.Header("Access-Control-Allow-Methods", "POST, PUT")
	context.JSON(200, gin.H{
		"object": catalog,
	})
}
