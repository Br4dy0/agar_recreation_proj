const http = require("http");
const fs = require("fs");
const path = require("path");
const server = http.createServer();

const bf = require("./server1.bf");

server.on("request", (req, res)=>{
  if(req.url === "/"){
    fs.readFile("./src/main.html", "utf-8", (err, data) =>{
      if (err) throw err;
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      res.end();
    });
  }else if (req.url.match("\.css$")){
    let cssPath = path.join("./src/css/main.css");
    let fileStream = fs.createReadStream(cssPath, "utf8");
    res.writeHead(200, {"content-Type": "text/css"});
    fileStream.pipe(res);
  }else if (req.url.match("\.js$")){
    let jsPath = path.join("./final/js/bundle.js");
    let fileStream = fs.createReadStream(jsPath, "utf8");
    res.writeHead(200, {"content-Type": "text/javascript"});
    fileStream.pipe(res);
  }else{
    res.writeHead(404, {"content-Type": "text/plain"});
    res.end("Content Not Found.");
  }
});
//Initiate 101
server.on("upgrade", (req, socket, head)=>{
  //console.log(req.headers.host/* S: ${socket} H: ${head}`*/);
  if(req.headers.origin === "http://localhost:8080"){
    if(req.headers.host === "bf.localhost:8080"){
      console.log("GO!");
      bf.conn(req, socket, head);
    }else{
      socket.destroy();
    }
  }
});
//Listen on Port 8080
console.log(`Listening to port 8080`);
server.listen(8080);