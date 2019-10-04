const http = require("http");
const fs = require("fs");
const path = require("path");
const server = http.createServer();
//Websocket Stuff
const WebSocket = require('ws');
const wss = new WebSocket.Server({ noServer:true });

server.on("request", (req, res)=>{
  //console.log(req.url);
  if(req.url === "/"){
    fs.readFile("./src/test/main.html", "utf-8", (err, data) =>{
      if (err) throw err;
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      res.end();
    });
  } else if (req.url.match("\.css$")){
    let cssPath = path.join("./src/test/main.css");
    let fileStream = fs.createReadStream(cssPath, "utf8");
    res.writeHead(200, {"content-Type": "text/css"});
    fileStream.pipe(res);
  }else if (req.url.match("\.js$")){
    let jsPath = path.join("./final/bundle.js");
    let fileStream = fs.createReadStream(jsPath, "utf8");
    res.writeHead(200, {"content-Type": "text/javascript"});
    fileStream.pipe(res);
  }else{
    res.writeHead(404, {"content-Type": "text/plain"});
    res.end("Page not found");
  }
});
server.on("upgrade", (req, socket, head)=>{
  //console.log(`R: ${req.url}`);
  if(req.url === "/"){
    wss.handleUpgrade(req, socket, head, (ws)=>{
      wss.emit("connection", ws, req);
    });
  } else {
    socket.destroy();
  }
});
wss.on("connection", ws => {
  console.log("CONNECTION ESTABLISHED");
  if(ws.readyState === 1){
    ws.send("TEST");
  }
  ws.on("open", () =>{
    //Do Stuff
  });
  ws.on("error", err =>{
    console.log(`ERROR: ${err}`);
  });
  ws.on("message", msg =>{
    console.log(`MESSAGE: ${msg}`);
  });
  ws.on("close", close =>{
    console.log(`CLOSED: ${close}`);
    ws.close();
  });
  console.log(`W: ${ws.eventNames()}`);
});
console.log(`Listening to port 8080`);
server.listen(8080);