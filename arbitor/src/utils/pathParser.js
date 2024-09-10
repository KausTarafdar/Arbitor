export default function parseRequest(path) {
  const path_var = path.split('/');
  path_var.shift();
  return {
    api_name : path_var[0],
    api_key : '/' + path_var.slice(1,path_var.length).join('/')
  }
}