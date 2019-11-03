const m = require("./main");
const b = require("./buttons");
const gc = require("./canvas.global");
const ctx = m.canvas.getContext("2d");

let _clientId = null;
let player = {objects:null};
let pellets = {r:null};
let server = {w:null, h:null};
let mouseCoords = {x:null, y:null};

//Initiate Client-Side
exports.init = () =>{
  const ws = new WebSocket("ws://bf.localhost:8080");
  ws.onopen = () =>{
    //When the webscoekt opens for the client
    ws.binaryType = "arraybuffer";
    m.menu.style.display = "none";
  };
  ws.onmessage = msg =>{
    //When the client recieves a message from the server.
    let data;
    try{
      data = msg.data;
      if(typeof data ===  "string"){
        console.log(data);
      }else{
        data = JSON.parse(String.fromCharCode.apply(null, new Uint8Array(msg.data)));
        if(data.id === "render"){
          player.objects = data.objects;
          updateCanavs(server.w, server.h, player.objects);
        }else if(data[0].id === "player"){
          //Get ClientId
          _clientId = data[0].clientId;
          setTimeout(()=>{
            sendMSG("open");
          }, 50);
          //Spawn Player
          player.objects = data[1].objects;
          updateCanavs(server.w, server.h, player.objects);
        }else if(data[0].id === "server" && data[1].id === "pellets"){
          server.w = data[0].width;
          server.h = data[0].height;
          pellets.r = data[1].r;
        }else{
          console.log(data);
        }
      }
    }
    catch(e){
      console.log(`${e} has occured with the message: ${msg.data}`);
    }
  };
  ws.onclose = () =>{
    //When the client closes the websocekt
    sendMSG("close")
  };
  window.onmousemove = window.onmouseover = (e)=>{
    mouseCoords.x = e.clientX;
    mouseCoords.y = e.clientY;
  };
  window.onresize = ()=>{
    updateCanavs(null);
  }
  window.onbeforeunload = ()=>{
    ws.onclose();
  };
  //Draw The Map
  const drawMap = (width, height, objects) =>{
    //Draw Border
    ctx.lineWidth = gc.BORDER_LINE_WIDTH;
    ctx.strokeStyle = gc.BORDER_STROKE_COLOR;
    ctx.strokeRect(ctx.lineWidth/2, ctx.lineWidth/2, width+ctx.lineWidth*2, height+ctx.lineWidth*2);
    //Draw Objects
    for(let i = 0; i < objects.length; i++){
      if(objects[i].t === 1){
        //Draw Pellets
        ctx.beginPath();
        ctx.arc(objects[i].x,
          objects[i].y,
          pellets.r,
          0, 2*Math.PI);
        ctx.fillStyle = gc.PELLET_COLOR;
        ctx.fill();
      }else if(objects[i].t === 3 && objects[i].id !== _clientId){
        //Draw Players
        ctx.beginPath();
        ctx.arc(objects[i].x,
          objects[i].y,
          objects[i].r,
          0, 2*Math.PI);
        ctx.fillStyle = objects[i].c;
        ctx.fill();
      }else{
        //Draw Players
        ctx.beginPath();
        ctx.arc(objects[i].x,
          objects[i].y,
          objects[i].r,
          0, 2*Math.PI);
        ctx.fillStyle = objects[i].c;
        ctx.fill();
      }
    }
  };
  const updateCanavs = (width, height, objects)=>{
    //Reset Map
    ctx.clearRect(
      ctx.lineWidth/2, 
      ctx.lineWidth/2, 
      width+(gc.BORDER_LINE_WIDTH*2), 
      height+(gc.BORDER_LINE_WIDTH*2));
    //Redraw Border
    drawMap(width, height, objects);
    //Call Request Animation Frame
    if(!gc.RAF_RUNNING){
      gc.RAF_RUNNING = true;
      raf();
    }
  }
  const raf = () =>{
    /* Ignore */
    window.requestAnimationFrame = 
    window.requestAnimationFrame || 
    window.mozRequestAnimationFrame ||                           
    window.webkitRequestAnimationFrame ||                                        
    window.msRequestAnimationFrame;
    /* Ignore */
    let start = null;
    let interval = 0;
    let frame = 1;
    const step = (timestamp)=>{
      //console.log(1);
      sendMSG("move");
      if(frame % 30 === 0){
        sendMSG("search");
      }
      if(frame === 59){
        frame = 0;
      }
      frame++;
      window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  };
  const sendMSG = (_id)=>{
    if(ws.readyState === 1){
      let holder = [];
      let message = {
        id:_id, 
        clientId:_clientId
      };
      message.id = _id;
      if(_id === "move"){
        message.content = {
          x: mouseCoords.x,
          y: mouseCoords.y
        }
      }else if(_id === "open"){
        message.content = message.clientId + ": OPENED";
      }else if(_id === "close"){
        message.content = message.clientId + ": CLOSED";
      }
      JSON.stringify(message).split("").forEach(x=>{
        x = x.charCodeAt(0);
        holder.push(x);
      });
      ws.send(new Uint8Array(holder));
    }
  };
}
      