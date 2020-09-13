package organizationservice

import (
	"corelab.mkcl.org/MKCLOS/coredevelopmentplatform/corepkgv2/utiliymdl/guidmdl"
	"github.com/naikVK/GOApp/internal/platform/goappmysql/organizationdao"
	"github.com/naikVK/GOApp/internal/platform/models"
)

// RegisterOrganizationDetails -
func RegisterOrganizationDetails(organization models.Organization) (string, error) {
	organization.OrgID = guidmdl.GetGUID()
	return organizationdao.CreateOrganization(organization)
}

// UpdateOrganizationDetails -
func UpdateOrganizationDetails(organization models.Organization) error {
	return organizationdao.UpdateOrganizationDetails(organization)
}

// FetchOrganizationDetails -
func FetchOrganizationDetails(orgID string) (models.Organization, error) {
	return organizationdao.ReadOrganizationDetails(orgID)
}

// AddServiceInOrganization -
func AddServiceInOrganization(orgID string, service models.Service) error {
	service.OrgID = orgID
	service.ServiceID = guidmdl.GetGUID()
	_, err := organizationdao.CreateService(service)
	return err
}

// FetchOrganizationServices -
func FetchOrganizationServices(orgID string) ([]models.Service, error) {
	return organizationdao.ReadServicesByOrgID(orgID)
}

// UpdateService -
func UpdateService(service models.Service) error {
	return organizationdao.UpdateService(service)
}
