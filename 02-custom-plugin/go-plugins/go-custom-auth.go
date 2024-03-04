package main
import (
  "github.com/Kong/go-pdk"
  "github.com/Kong/go-pdk/server"
)

func main() {
  server.StartServer(New, Version, Priority)
}
var Version = "0.2"
var Priority = 1
type Config struct {
  IntrospectionEndpoint string `json:"introspection_endpoint" required:"true" starts_with:"http" description:"The URL of the HTTP request that retrieves token information."`
	RequestTokenHeader string `json:"my_field_2" description:"ตัวอย่าง config 2" required:"false"`
}
func New() interface{} {
  return &Config{}
}
func (conf Config) Access(kong *pdk.PDK) {
  message := ""
  if message == "" {
    message = "hello"
  }
  kong.Log.Notice("Message: " + message)
}
