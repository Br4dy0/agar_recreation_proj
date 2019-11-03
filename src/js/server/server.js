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
  //When the connection is established...
  if(bf.server.count < bf.server._limit){
    //Send Client server confirmation message
    ws.send("SERVER MESSAGE: OPENED");
    //Send necessary information
    ws.send(JSON.stringify(bf.sendInfo()), {binary:true});
    //Spawns the player
    ws.send(JSON.stringify(bf.playerSpawn()), {binary:true});
    //Error 
    ws.on("error", err =>{
      console.log(`ERROR: ${err}`);
    });
    //Message
    ws.on("message", msg =>{
      try{
        let convertMSG = msg.toString("utf-8");
        let message = JSON.parse(convertMSG);
        if(message.id === "move"){
          //Update player coords
          ws.send(JSON.stringify(bf.playerMovement(message)), {binary:true});
        }else if(message.id === "search"){
          //Update render search list.
          bf.staticSearchList(message);
        }else if(message.id === "open"){
          console.log(message.content);
        }else if(message.id === "close"){
          console.log(message.content);
          bf.playerLeft(message);
        }
      }
      catch(e){
        console.log(`Error: ${e} / Message: ${msg}`);
      }
    });
    //Close
    ws.on("close", () =>{
      ws.close();
    });
  }else{
    //Send Client server confirmation message
    ws.send("SERVER MESSAGE: SERVER IS FULL!");
    //Close the socekt
    ws.close();
  }
});
console.log(`Listening to port 8080`);
server.listen(8080);