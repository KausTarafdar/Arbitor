export const gatewayUrl = "http://localhost:5000/register"

export const apiData = {
  "api_name" : "proto_message",
  "base_url" : "http://localhost",
  "port"     : "3001",
}

export const routes = [
  {
    "api_key"     : "/health",
    "endpoint"    : "/health",
    "access_type" : "public",
  },
  {
    "api_key"     : "/send/message",
    "endpoint"    : "/message",
    "access_type" : "public",
  },
  {
    "api_key"     : "/user/messages",
    "endpoint"    : "/messages",
    "access_type" : "public",
  },
  {
    "api_key"     : "/user/edit/message",
    "endpoint"    : "/edit/message",
    "access_type" : "public",
  }
]