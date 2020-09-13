package logindao

import (
	"github.com/naikVK/GOApp/internal/platform/goappmysql"
	"github.com/naikVK/GOApp/internal/platform/models"
)

// SaveLoginDetails -
func SaveLoginDetails(loginDetails models.LoginDetails) (string, error) {
	conn := goappmysql.GetMySQLConnection()
	query := `insert into login_tbl (username, password) values (?,?)`
	return conn.ExecQuery(query, loginDetails.Username, loginDetails.Password)
}

// GetVolunteerDetailsByID -
func GetVolunteerDetailsByID(Username string) (models.Volunteer, error) {
	conn := goappmysql.GetMySQLConnection()
	query := `select * from volunteer_tbl WHERE username = ?`
	var volunteer models.Volunteer
	err := conn.SelectOne(&volunteer, query, Username)
	return volunteer, err
}
