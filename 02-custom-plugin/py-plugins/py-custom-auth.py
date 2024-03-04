#!/usr/bin/env python3
import os
import kong_pdk.pdk.kong as kong
import requests

Schema = (
  {
    "introspection_endpoint": {
      "type": "string",
      "required": True,
      "starts_with": "http",
      "description": "The URL of the HTTP request that retrieves token information."
    }
  },
  {
    "request_token_header": {
      "type": "string",
      "required": True,
      "default": "Authorization",
      "description": "Retrieve the value from a specified request header and store it in a named property."
    }
  },
  {
    "introspection_token_header": {
      "type": "string",
      "required": True,
      "default": "Authorization",
      "description": "Assign the value of a named property to a specific header in the introspection endpoint request."
    }
  },
  {
    "set_token_info_header": {
      "type": "boolean",
      "default": False,
      "description": "An optional value that defines whether the original HTTP request headers are sent token information object in the request headers."
    }
  }
)

version = '0.1.0'
priority = 0

class Plugin(object):
  def __init__(self, config):
    self.config = config

  def access(self, kong: kong.kong):
    req_header_name = self.config["request_token_header"]
    authorization_header = kong.request.get_header(req_header_name)
    if not authorization_header or not authorization_header[0]:
      kong.response.exit(401, { "message": 'Authorization header required. Must follow the scheme, \'Authorization: Bearer <ACCESS TOKEN>\'' })
      return
    
    endpoint_header_name = self.config["introspection_token_header"]
    endpoint = self.config["introspection_endpoint"]

    try:
      headers = {
        endpoint_header_name: authorization_header[0]
      }
      res = requests.post(endpoint, headers=headers)

      if self.config["set_token_info_header"]:
        kong.service.request.add_header('auth_user', res.text)
    except Exception as e:
      kong.response.exit(500, { "message": "Something went wrong. Please try again." })


if __name__ == "__main__":
  from kong_pdk.cli import start_dedicated_server
  start_dedicated_server("py-custom-plugin", Plugin, version, priority, Schema)