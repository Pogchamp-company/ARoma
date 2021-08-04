package main

import (
	"aroma/middlewares"
	"aroma/routes"
	"aroma/seeds"
	"flag"
	"fmt"
	"os"
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
	fmt.Println("\tdb migrate [optional: migrationName]\tcreate new migration for database")
	fmt.Println("\tdb upgrade\t\t\texecute up migrations")
	fmt.Println("\tdb downgrade\t\t\texecute down migrations")
	fmt.Println("\tdb seed [optional: seedName]\texecute all seeders")
}

func runServer() {
	var App = routes.App
	App.Use(middlewares.HeadersMiddleware())
	routes.InitRoutes()
	App.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
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
	seedName := flag.Arg(2)
	seedsByNames := seeds.GetAllSeeds()
	if seedName != "" {
		if seed, ok := seedsByNames[seedName]; ok {
			seed()
		} else {
			fmt.Printf("Seed %s does not exist", seedName)
		}
	} else {
		for _, seederFunc := range seedsByNames {
			seederFunc()
		}
	}

}

func upgradeDb() {
	executeDbCommand("-database", os.Getenv("POSTGRESQL_URI"), "-path", "migrations", "up")
}

func downgradeDb() {
	executeDbCommand("-database", os.Getenv("POSTGRESQL_URI"), "-path", "migrations", "down", "1")
}

func migrateDb() {
	migrationName := flag.Arg(2)
	args := []string{"create", "-ext", "sql", "-dir", "migrations"}
	args = append(args, "-seq")
	args = append(args, migrationName)
	executeDbCommand(args...)
}

func executeDbCommand(arg ...string) {
	// construct `go version` command
	cmd := exec.Command("migrate", arg...)

	// configure `Stdout` and `Stderr`
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stdout

	// run command
	if err := cmd.Run(); err != nil {
		fmt.Println("Error:", err)
	}
}
