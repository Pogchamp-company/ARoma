package routes

import "aroma/handlers"

func initUsersRoutes() {
	App.POST("/login", handlers.Login)
	App.POST("/register", handlers.RegisterUser)
	App.GET("/check_username", handlers.CheckUsername)
	App.GET("/check_email", handlers.CheckEmail)
}
