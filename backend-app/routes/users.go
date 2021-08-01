package routes

import "aroma/handlers"

func initUsersRoutes() {
	App.POST("/login", handlers.Login)
	App.POST("/register", handlers.RegisterUser)
}
