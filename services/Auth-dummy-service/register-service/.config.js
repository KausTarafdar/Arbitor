export const gatewayUrl = "http://localhost:5000/api/register"

export const apiData = {
  "api_name" : "proto_login",
  "base_url" : "http://localhost",
  "port"     : "3000",
}

export const routes = [
  {
    "api_key"     : "/health",
    "endpoint"    : "/health",
    "access_type" : "public",
  },
  {
    "api_key"     : "/login",
    "endpoint"    : "/login",
    "access_type" : "public",
  },
  {
    "api_key"     : "/logout",
    "endpoint"    : "/logout",
    "access_type" : "public",
  }
]