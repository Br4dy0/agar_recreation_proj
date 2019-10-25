const http = require("http");
const fs = require("fs");
const path = require("path");
const server = http.createServer();
const bf = require("./server.bf");
//Websocket Stuff
const WebSocket = require('ws');
const wss = new WebSocket.Server({ noServer:true });
//Load Webpage 
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
  ws.binaryType = "blob";
  //When the connection is established...
  if(bf.server.count < bf.server._limit){
    //Send Client server confirmation message
    ws.send("SERVER MESSAGE: OPENED");
    //Create new player
    bf.newPlayer();
  }else{
    //Send Client server confirmation message
    ws.send("SERVER MESSAGE: SERVER IS FULL!");
    //Close the socekt
    ws.close();
  }
  //Send Server to every client
  wss.clients.forEach(client=>{
    client.send(JSON.stringify(bf.server));
  });
  ws.on("error", err =>{
    console.log(`ERROR: ${err}`);
  });
  ws.on("message", msg =>{
    try{
      let message = JSON.parse(msg);
      if(message.type === "open"){
        console.log(`CLIENT MESSAGE: ${message.content}`);
      }else if(message.type === "mousemove"){
        bf.playerMovement(message);
        wss.clients.forEach(client=>{
          client.send(JSON.stringify(bf.server));
        });
      }else if(message.type === "close"){
        bf.playerLeft(message);
        wss.clients.forEach(client=>{
          if(client !== ws){
            client.send(JSON.stringify(bf.server));
          }
        });
      }
    }
    catch(e){
      //console.log(e);
    }
  });
  ws.on("close", close =>{
    console.log(`CLOSED: ${close}`);
    ws.close();
  });
});
console.log(`Listening to port 8080`);
server.listen(8080);