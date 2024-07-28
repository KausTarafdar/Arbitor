export default function checkEmptyBody(req) {
  if(!req.body.serviceName) {
    return false;
  }
  else {
    return true;
  }
}