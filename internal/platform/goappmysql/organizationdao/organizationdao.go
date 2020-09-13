package organizationdao

import (
	"github.com/naikVK/GOApp/internal/platform/goappmysql"
	"github.com/naikVK/GOApp/internal/platform/models"
)

//CreateOrganization -
func CreateOrganization(organization models.Organization) (string, error) {
	conn := goappmysql.GetMySQLConnection()
	query := `insert into organization_tbl (orgId, name, description, street, city, 
			district, state, pincode) values (?,?,?,?,?,?,?,?)`
	return conn.ExecQuery(query, organization.OrgID, organization.Name,
		organization.Description, organization.Address.Street, organization.Address.City,
		organization.Address.District, organization.Address.State, organization.Address.Pincode)
}

//UpdateOrganizationDetails -
func UpdateOrganizationDetails(organization models.Organization) error {
	conn := goappmysql.GetMySQLConnection()
	query := `update organization_tbl SET name = ?, 
			SET description = ?, SET regNo = ?, SET street=?, 
			SET city=?, SET district=?, SET state=?, SET pincode=? 
			WHERE orgId=?`
	_, err := conn.ExecQuery(query, organization.Name, organization.Description,
		organization.Address.Street, organization.Address.City,
		organization.Address.District, organization.Address.State,
		organization.Address.Pincode, organization.OrgID)
	return err
}

// ReadOrganizationDetails -
func ReadOrganizationDetails(orgID string) (models.Organization, error) {
	conn := goappmysql.GetMySQLConnection()
	query := `select * from organization_tbl WHERE orgId=?`
	var organization models.Organization
	err := conn.SelectOne(&organization, query, orgID)
	return organization, err
}

// CreateService -
func CreateService(service models.Service) (string, error) {
	conn := goappmysql.GetMySQLConnection()
	query := `insert into service_tbl (serviceId, name, description, orgId) values (?,?,?,?)`
	return conn.ExecQuery(query, service.ServiceID, service.Name, service.Description, service.OrgID)
}

// UpdateService -
func UpdateService(service models.Service) error {
	conn := goappmysql.GetMySQLConnection()
	query := `update service_tbl SET name = ?, 
			SET description = ? WHERE serviceId = ?`
	_, err := conn.ExecQuery(query, service.Name, service.Description, service.ServiceID)
	return err
}

// ReadServicesByOrgID -
func ReadServicesByOrgID(orgID string) ([]models.Service, error) {
	conn := goappmysql.GetMySQLConnection()
	query := `select * from service_tbl WHERE orgId=?`
	services := make([]models.Service, 0)
	err := conn.SelectAll(&services, query, orgID)
	return services, err
}
