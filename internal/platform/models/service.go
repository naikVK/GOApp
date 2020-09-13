package models

// Service - represents organization services
type Service struct {
	ServiceID   string `json:"serviceId" sql:"serviceId"`
	Name        string `json:"name" sql:"name"`
	Description string `json:"description" sql:"description"`
	OrgID       string `json:"orgId" sql:"orgId"`
}
