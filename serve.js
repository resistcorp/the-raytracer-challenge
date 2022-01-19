import http from "http"
import url from "url"
import fs from "fs/promises"

const PORT = 5000;

const server = http.createServer(async (request, result) => {
  const parsedURL = url.parse(request.url, false);
  try{
    let ext = extension(parsedURL.path);
    switch(ext.toLowerCase()){
      case ".js" : 
        result.setHeader("Content-Type", "application/javascript");
        break;
      case ".html" :
      case ".htm" :
        result.setHeader("Content-Type", "text/html");
        break;
      default :
        throw "unhandled extension : " + ext;
    }
    result.writeHead(200)
    let payload = await fs.readFile("./" + parsedURL.path, "utf8", "r");
    result.end(payload);
  }catch(e){
    console.error(e);
    result.writeHead(403)
    result.end(null);
  }
});

server.listen(PORT, _ => {
  console.log("dev server listening on port", PORT);
});

/** returns the .ext of a filepath */
function extension(path){
  let index = path.lastIndexOf(".");
  if(index !== -1)
    return path.substr(index);
  return "";
}
