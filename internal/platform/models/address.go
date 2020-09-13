package models

//Address -
type Address struct {
	Street   string `json:"street" sql:"street"`
	City     string `json:"city" sql:"city"`
	Pincode  string `json:"pincode" sql:"pincode"`
	District string `json:"district" sql:"district"`
	State    string `json:"state" sql:"state"`
}
