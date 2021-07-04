package main

func main() {
	InitRoutes()
	err := App.Run()
	if err != nil {
		return
	} // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
