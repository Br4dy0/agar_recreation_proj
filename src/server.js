const http = require("http");
const fs = require("fs");
const path = require("path");
const server = http.createServer();
const bf = require("./test/server.bf");
//Websocket Stuff
const WebSocket = require('ws');
const wss = new WebSocket.Server({ noServer:true });
//Load Webpage 
server.on("request", (req, res)=>{
  if(req.url === "/"){
    fs.readFile("./src/test/main.html", "utf-8", (err, data) =>{
      if (err) throw err;
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      res.end();
    });
  }else if (req.url.match("\.css$")){
    let cssPath = path.join("./css/main.css");
    let fileStream = fs.createReadStream(cssPath, "utf8");
    res.writeHead(200, {"content-Type": "text/css"});
    fileStream.pipe(res);
  }else if (req.url.match("\.js$")){
    let jsPath = path.join("./js/bundle.js");
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
  if(req.url === "/"){
    wss.handleUpgrade(req, socket, head, (ws)=>{
      wss.emit("connection", ws, req);
    });
  } else {
    socket.destroy();
  }
});
//Websocket Connection
wss.on("connection", ws => {
  //When the connection is established...
  let message = "";
  ws.send(JSON.stringify(bf.pel));
  bf.cP();
  wss.clients.forEach(client=>{
    client.send(JSON.stringify(bf.sI));
  });
  ws.on("error", err =>{
    console.log(`ERROR: ${err}`);
  });
  ws.on("message", msg =>{
    console.log(`CLIENT MESSAGE: ${msg}`);
    message = msg;
  });
  ws.on("close", close =>{
    console.log(`CLOSED: ${close}`);
    bf.sI.playerList.forEach(x=>{
      if(x.clientId === message){
        bf.sI.playerList.pop(x);
        bf.sI.playerId.pop(x);
      }
    });
    console.log(bf.sI.playerList);
    bf.sI.playerCount--;
    wss.clients.forEach(client=>{
      if(client !== ws){
        client.send(JSON.stringify(bf.sI));
      }
    });
    ws.close();
  });
});
console.log(`Listening to port 8080`);
server.listen(8080);