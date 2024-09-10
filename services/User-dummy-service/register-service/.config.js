export const gatewayUrl = "http://localhost:5000/register"

export const apiData = {
  "api_name" : "proto_user",
  "base_url" : "http://localhost",
  "port"     : "3002",
}

export const routes = [
  {
    "api_key"     : "/health",
    "endpoint"    : "/health",
    "access_type" : "public",
  },
  {
    "api_key"     : "/user/friends",
    "endpoint"    : "/friends",
    "access_type" : "public",
  },
  {
    "api_key"     : "/user/groups",
    "endpoint"    : "/groups",
    "access_type" : "public",
  },
  {
    "api_key"     : "/user/exit/group",
    "endpoint"    : "/delete/group",
    "access_type" : "public",
  }
]