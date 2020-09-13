package volunteerhandler

import (
	"github.com/gin-gonic/gin"
)

//Init initalizes vlounteer's apis
func Init(o, r, c *gin.RouterGroup) {
	o.POST("/volunteers")
	o.POST("/volunteers/:id")
}
