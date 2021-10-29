package seeds

import (
	"aroma/models"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"path/filepath"
	"strings"
)

var baseDir = "seeds/data"

func readJSON(filename string) []map[string]string {
	plan, _ := ioutil.ReadFile(filepath.Join(baseDir, filename+".json"))
	var data []map[string]string
	err := json.Unmarshal(plan, &data)
	if err != nil {
		panic(err)
	}
	return data
}

func generateSQLQuery(tableName string, keys []string) string {
	queryTemplate := "INSERT INTO %s(%s) VALUES (%s)"
	return fmt.Sprintf(queryTemplate, tableName, strings.Join(keys[:], ","), strings.Trim(strings.Repeat("?,", len(keys)), ","))
}

func insertFromJSON(tableName string, filename string) {
	data := readJSON(filename)
	for _, object := range data {
		keys := make([]string, 0, len(object))
		values := make([]interface{}, 0, len(object))

		for k, v := range object {
			keys = append(keys, k)
			values = append(values, v)
		}
		query := generateSQLQuery(tableName, keys)
		models.Db.Exec(query, values...)
	}
}
