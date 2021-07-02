package main

import "./routes"

func main() {
	routes.InitRoutes()
	routes.App.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
