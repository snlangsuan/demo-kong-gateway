'use strict'

const { version: Version } = require('./package.json')
const axios = require('axios')

class CustomAuthPlugin {
  constructor(config) {
    this.config = config
  }

  async access(kong) {
    const req_header_name = this.config.request_token_header
    const authorization_header = await kong.request.get_header(req_header_name)
    if (!authorization_header) {
      await kong.response.exit(401, { message: 'Authorization header required. Must follow the scheme, \'Authorization: Bearer <ACCESS TOKEN>\'' })
      return
    }
    const endpoint_header_name = this.config.introspection_token_header
    const endpoint = this.config.introspection_endpoint
    try {
      const res = await axios({
        method: 'post',
        url: endpoint,
        headers: {
          [endpoint_header_name]: authorization_header,
        }
      })
      if (this.config.set_token_info_header) {
        await kong.service.request.add_header('auth_user', JSON.stringify(res.data))
      }
    } catch (error) {
      const status = error.response && error.response.status ? error.response.status : 500
      const body = error.response && error.response.data ? error.response.data : { message: 'Something went wrong. Please try again.' }
      await kong.response.exit(status, body)
    }
  }
}

module.exports = {
  Plugin: CustomAuthPlugin,
  Name: 'js-custom-auth',
  Schema: [
    {
      introspection_endpoint: {
        type: 'string',
        required: true,
        starts_with: 'http',
        description: 'The URL of the HTTP request that retrieves token information.'
      }
    },
    {
      request_token_header: {
        type: 'string',
        required: true,
        default: 'Authorization',
        description: 'Retrieve the value from a specified request header and store it in a named property.'
      }
    },
    {
      introspection_token_header: {
        type: 'string',
        required: true,
        default: 'Authorization',
        description: 'Assign the value of a named property to a specific header in the introspection endpoint request.'
      }
    },
    {
      set_token_info_header: {
        type: 'boolean',
        default: false,
        description: 'An optional value that defines whether the original HTTP request headers are sent token information object in the request headers.'
      }
    }
  ],
  Version,
  Priority: 0,
}
