package volunteerdao

import (
	"github.com/naikVK/GOApp/internal/platform/goappmysql"
	"github.com/naikVK/GOApp/internal/platform/models"
)

// SaveVolunteerDetails -
func SaveVolunteerDetails(volunteer models.Volunteer) (string, error) {
	conn := goappmysql.GetMySQLConnection()
	query := `insert into volunteer_tbl (username, name, mobileNo, email, isSpoc, 
			ngoId, street, city, district, state, pincode) values (?,?,?,?,?,?,?,?,?,?,?)`
	return conn.ExecQuery(query, volunteer.Username, volunteer.Name, volunteer.MobileNo,
		volunteer.Email, volunteer.IsSpoc, volunteer.NgoID, volunteer.Address.Street,
		volunteer.Address.City, volunteer.Address.District, volunteer.Address.State,
		volunteer.Address.Pincode)
}

// UpdateVolunteerDetails -
func UpdateVolunteerDetails(volunteer models.Volunteer) error {
	conn := goappmysql.GetMySQLConnection()
	query := `update volunteer_tbl SET name = ?, 
			SET mobileNo = ?, SET email = ?, 
			SET ngoId=?, SET street=?, city=?, SET district=?, 
			SET state=?, SET pincode=? WHERE username=?`
	_, err := conn.ExecQuery(query, volunteer.Name, volunteer.MobileNo, volunteer.Email,
		volunteer.NgoID, volunteer.Address.Street, volunteer.Address.City,
		volunteer.Address.District, volunteer.Address.State, volunteer.Address.Pincode,
		volunteer.Username)
	return err
}

// GetVolunteerDetailsByID -
func GetVolunteerDetailsByID(Username string) (models.Volunteer, error) {
	conn := goappmysql.GetMySQLConnection()
	query := `select * from volunteer_tbl WHERE username = ?`
	var volunteer models.Volunteer
	err := conn.SelectOne(&volunteer, query, Username)
	return volunteer, err
}
