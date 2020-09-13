package organizationhandler

import (
	"net/http"

	"github.com/naikVK/GOApp/internal/services/organizationservice"

	"github.com/naikVK/GOApp/internal/platform/models"

	"github.com/gin-gonic/gin"
)

//Init initialize orginization routes
func Init(o, r, c *gin.RouterGroup) {
	r.POST("/orgs", registerOrganizationDetails)
	r.POST("/orgs/:orgId", updateOrganizationDetails)
	r.GET("/orgs/:orgId", fetchOrganizationDetails)
	r.POST("/orgs/:orgId/services", addService)
	r.GET("/orgs/:orgId/services", fetchServicesByOrgID)
	r.POST("/orgs/:orgId/services/:serviceId", updateService)
	// registration
	r.POST("/registration", registerUser)

	// r.DELETE("/orgs/:orgId/services/:serviceId", deleteService)

}

func registerOrganizationDetails(c *gin.Context) {
	var organization models.Organization
	c.Bind(&organization)
	if err := c.Bind(&organization); err != nil {
		c.JSON(http.StatusBadRequest, "please provide valid data")
		return
	}
	_, err := organizationservice.RegisterOrganizationDetails(organization)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, "success")
}

func updateOrganizationDetails(c *gin.Context) {
	// orgID := c.Param("orgId")
	var organization models.Organization
	c.Bind(&organization)
	if err := c.Bind(&organization); err != nil {
		c.JSON(http.StatusBadRequest, "please provide valid data")
		return
	}
	err := organizationservice.UpdateOrganizationDetails(organization)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, "success")
}

func fetchOrganizationDetails(c *gin.Context) {
	orgID := c.Param("orgId")
	organizationDetails, err := organizationservice.FetchOrganizationDetails(orgID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, organizationDetails)
}

func addService(c *gin.Context) {
	orgID := c.Param("orgId")
	var service models.Service
	if err := c.Bind(&service); err != nil {
		c.JSON(http.StatusBadRequest, "please provide valid data")
		return
	}
	err := organizationservice.AddServiceInOrganization(orgID, service)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, "success")
}

func fetchServicesByOrgID(c *gin.Context) {
	orgID := c.Param("orgId")
	services, err := organizationservice.FetchOrganizationServices(orgID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, services)
}

func updateService(c *gin.Context) {
	var service models.Service
	if err := c.Bind(&service); err != nil {
		c.JSON(http.StatusBadRequest, "please provide valid data")
		return
	}
	err := organizationservice.UpdateService(service)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, "success")
}

func registerUser(c *gin.Context) {

	var volunteerData models.Volunteer
	c.Bind(&volunteerData)
	if err := c.Bind(&volunteerData); err != nil {
		c.JSON(http.StatusBadRequest, "please provide valid data")
		return
	}
	_, err := organizationservice.RegisterOrganizationDetails(organization)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, "success")
}
