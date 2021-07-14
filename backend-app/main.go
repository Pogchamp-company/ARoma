package main

import (
	"aroma/middlewares"
	"aroma/routes"
)

func main() {
	routes.App.Use(middlewares.HeadersMiddleware())
	routes.InitRoutes()
	routes.App.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
