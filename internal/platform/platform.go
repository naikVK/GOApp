package platform

import (
	"github.com/naikVK/GOApp/internal/platform/goappmysql"
)

func Init(configPath string) {
	goappmysql.Init(configPath)
}
