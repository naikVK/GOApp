package models

// LoginDetails ...
type LoginDetails struct {
	Username string
	Password string
	Role     []string
}

// UserRole ...
type UserRole struct {
	RoleID string
	Name   string
}
