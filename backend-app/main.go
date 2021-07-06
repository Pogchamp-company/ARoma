package main

func main() {
	InitRoutes()
	App.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
