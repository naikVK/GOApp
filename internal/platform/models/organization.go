package models

//Organization -
type Organization struct {
	OrgID       string  `json:"orgId" sql:"orgId"`
	Name        string  `json:"name" sql:"orgId"`
	Description string  `json:"description" sql:"description"`
	Address     Address `json:"address" sql:"Address"`
}
