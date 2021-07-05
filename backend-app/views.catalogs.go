package main

import (
	"github.com/gin-gonic/gin"
	"strconv"
)

func GetCatalog(context *gin.Context) {
	catalogId, _ := strconv.ParseInt(context.Param("catalog_id"), 10, 64)
	var catalog Catalog
	Db.First(&catalog, catalogId)
	context.JSON(200, gin.H{
		"body": catalog,
	})
}
