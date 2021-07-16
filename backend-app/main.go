package main

import (
	"aroma/middlewares"
	"aroma/routes"
	"aroma/seeds"
	"flag"
	"fmt"
	"os/exec"
)

func main() {
	flag.Parse()
	command := flag.Arg(0)
	switch command {
	case "runserver":
		runServer()
	case "db":
		dbCommands()
	default:
		help()
	}
}

func help() {
	fmt.Println("Tools for manage ARoma project.")
	fmt.Println("\nUsage:")
	fmt.Println("\n\tgo run . <command> [arguments]")
	fmt.Println("\nThe commands are:")
	fmt.Println("\n\trunserver\t\t\trun rest-api server")
	fmt.Println("\tdb migrate [optional: -n]\tcreate new migration for database")
	fmt.Println("\tdb upgrade\t\t\texecute up migrations")
	fmt.Println("\tdb downgrade\t\t\texecute down migrations")
	fmt.Println("\tdb seed\texecute all seeders")
}

func runServer() {
	routes.App.Use(middlewares.HeadersMiddleware())
	routes.InitRoutes()
	routes.App.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}

func dbCommands() {
	dbCommand := flag.Arg(1)
	switch dbCommand {
	case "upgrade":
		upgradeDb()
	case "downgrade":
		downgradeDb()
	case "migrate":
		migrateDb()
	case "seed":
		runSeeds()
	}
}

func runSeeds() {
	var seedName string
	flag.StringVar(&seedName, "n", "", "Seeder name")
	seedsByNames := map[string]func(){
		"catalogs": seeds.CatalogsSeeder,
		"products": seeds.ProductsSeeder,
	}
	if seedName != "" {
		seedsByNames[seedName]()
	} else {
		for _, seederFunc := range seedsByNames {
			seederFunc()
		}
	}

}

func upgradeDb() {
	executeDbCommand("-database", "\"${POSTGRESQL_URI}\"", "-path", "migrations", "up")
}

func downgradeDb() {
	executeDbCommand("-database", "\"${POSTGRESQL_URI}\"", "-path", "migrations", "down")
}

func migrateDb() {
	var migrationName string
	flag.StringVar(&migrationName, "n", "", "Migration name")
	args := []string{"create", "-ext", "sql", "-dir", "migrations"}
	if migrationName != "" {
		args = append(args, "-seq")
		args = append(args, migrationName)
	}
	executeDbCommand(args...)
}

func executeDbCommand(arg ...string) {
	command := exec.Command("migrate", arg...)
	stdout, err := command.Output()
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	// Print the output
	fmt.Println(string(stdout))
}
