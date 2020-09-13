package models

// Volunteer -
type Volunteer struct {
	Username string  `json:"username" sql:"username"`
	Name     string  `json:"name" sql:"name"`
	MobileNo string  `json:"mobileNo" sql:"mobileNo"`
	Email    string  `json:"email" sql:"email"`
	IsSpoc   bool    `json:"isSpoc" sql:"isSpoc"`
	NgoID    string  `json:"ngoId" sql:"ngoId"`
	Address  Address `json:"address" sql:"address"`
}
