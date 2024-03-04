local http = require "resty.http"
local cjson = require "cjson.safe"

local plugin = {
  PRIORITY = 1000,
  VERSION = "0.1",
}

function plugin:access(conf)
  local req_header_name = conf.request_token_header
  local authorization_header = kong.request.get_header(req_header_name)

  if not authorization_header then
    kong.response.exit(401, { message = 'Authorization header required. Must follow the scheme, \'Authorization: Bearer <ACCESS TOKEN>\'' })
    return
  end

  endpoint_header_name = conf.introspection_token_header
  endpoint = conf.introspection_endpoint

  local httpc = http:new()
  local res, _err = httpc:request_uri(endpoint, {
    method = "POST",
    headers = { [endpoint_header_name] = authorization_header, }})

  if not res then
    kong.response.exit(500, { message = "Something went wrong. Please try again." })
    return
  end

  if res.status ~= 200 then
    kong.response.exit(res.status, { message = res.body })
    return
  end

  if conf.set_token_info_header then
    kong.service.request.add_header('auth_user', res.body)
    return
  end
end

return plugin
