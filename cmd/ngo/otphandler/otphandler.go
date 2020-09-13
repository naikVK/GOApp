package otphandler

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

//Init initializes otp related APIs
func Init(o, r, c *gin.RouterGroup) {
	o.POST("/sendotp", sendotp)
	o.POST("/validateotp", validateotp)
}

func sendotp(c *gin.Context) {
	mobileNo := c.GetString("mobileNo")
	if len(mobileNo) == 0 {
		c.JSON(http.StatusBadRequest, "please provide of mobile no")
		return
	}

	c.JSON(http.StatusOK, "success")
}

func validateotp(c *gin.Context) {
	c.JSON(http.StatusOK, "success")
}
