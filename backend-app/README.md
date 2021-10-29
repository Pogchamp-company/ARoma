# Install guide

## Prerequisites
1. [Go](https://golang.org/)
2. [PostgreSQL](https://www.postgresql.org)
3. [Minio](https://docs.min.io)
4. [GoMigrate](https://github.com/golang-migrate/migrate)

## Setup
```shell
cd backend-app
docker-compose up -d minio
go mod init
export POSTGRESQL_URI={YOUR_DB_URI}
```

## Setup database
```shell
go run main.go db upgrade
go run main.go db seed  # optional
```

## Run
```shell
go run main.go runserver
```