local typedefs = require "kong.db.schema.typedefs"
local PLUGIN_NAME = "lua-custom-auth"

local schema = {
  name = PLUGIN_NAME,
  fields = {
    { consumer = typedefs.no_consumer },
    { protocols = typedefs.protocols_http },
    { config = {
        type = "record",
        fields = {
          { introspection_endpoint = {
            type = "string",
            required = true,
            starts_with = "http",
            description = "The URL of the HTTP request that retrieves token information.", }},
          { request_token_header = {
            type = "string",
            required = true,
            default = "Authorization",
            description = "Retrieve the value from a specified request header and store it in a named property.", }},
          { introspection_token_header = {
            type = "string",
            required = true,
            default = "Authorization",
            description = "Assign the value of a named property to a specific header in the introspection endpoint request.", }},
          { set_token_info_header = {
            type = "boolean",
            default = false,
            description = "An optional value that defines whether the original HTTP request headers are sent token information object in the request headers.", }},
        },
      },
    },
  },
}

return schema
