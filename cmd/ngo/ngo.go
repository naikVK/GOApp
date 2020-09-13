package main

import (
	"corelab.mkcl.org/MKCLOS/coredevelopmentplatform/corepkgv2/configmdl"
	"github.com/naikVK/GOApp/internal/platform/store"
)

type Config struct {
	Port int
}

var ProjectConfig Config

func main() {
	configmdl.InitConfig("/config.toml", &ProjectConfig)
	store.Init("/db-config.toml")
	
		engine := gin.Default()
		o := engine.Group("/o")
		r := engine.Group("/r")
		c := engine.Group("/c")
		otphandler.Init(o, r, c)
		volunteerhandler.Init(o, r, c)
		organizationhandler.Init(o, r, c)
	
}
