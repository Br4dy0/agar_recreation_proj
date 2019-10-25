const m = require("./main");
const b = require("./buttons");
const gc = require("./canvas.global");
const ctx = m.canvas.getContext("2d");

let clientId = "";
let message = { type:null, clientId:null, content:null};
let server = null;
let mouseCoords = {x:null, y:null};

//Initiate Client-Side
exports.init = () =>{
  if(b.botfrenzy.isActive){
    const ws = new WebSocket("ws://localhost:8080");
    ws.onopen = () =>{
      //Send Opened
      message.type = "open";
      message.content = "CLIENT-SIDE: OPENED";
      ws.send(JSON.stringify(message));
      m.menu.style.display = "none";
    };
    ws.onmessage = msg =>{
      let data;
      data = msg.data;
      if(data.substring(0, 15) === "SERVER MESSAGE:"){
        console.log(data);
      }else{
        try{
          data = JSON.parse(msg.data);
          if(data.id === "server"){
            server = data;
            /* Define clientId */
            const assignPlayerId = ()=>{
              clientId = data.ids[data.ids.length - 1];
              message.clientId = clientId;
            };
            if(!clientId){
              assignPlayerId();
            }
            /* Define clientId */
            updateCanavs(data);
          }else{
            //Log the message
            console.log(`SERVER MESSAGE: ${msg.data}`);
          }
        }
        catch(e){
          console.log(`An error has occured: ${msg.data}`);
        }
      }
    };
    ws.onclose = () =>{
      //Send Closed
      message.type = "close";
      message.content = message.clientId;
      ws.send(JSON.stringify(message));
    };
    window.onbeforeunload = ()=>{
      ws.onclose();
    };
    window.onmousemove = (e)=>{
      mouseCoords.x = e.clientX;
      mouseCoords.y = e.clientY;
    };
    window.onresize = ()=>{
      updateCanavs(null);
    }
    //Draw Border
    const drawBorder = (width, height) =>{
      ctx.lineWidth = gc.BORDER_LINE_WIDTH;
      ctx.strokeStyle = gc.BORDER_STROKE_COLOR;
      ctx.strokeRect(ctx.lineWidth/2, ctx.lineWidth/2, width+ctx.lineWidth*2, height+ctx.lineWidth*2);
    };
    //Draw Pellets
    const drawPellets = (s) =>{
      for(let i = 0; i < s.pellets[0]._count; i++){
        ctx.beginPath();
        ctx.arc(s.pellets[0]._array[i].x, 
          s.pellets[0]._array[i].y, 
          s.pellets[0]._radius, 
          0, 2*Math.PI);
        ctx.fillStyle = gc.PELLET_COLOR;
        ctx.fill();
      }
    };
    //Draw Viruses
    const drawViruses = (s) =>{
      //console.log("Great!");
    };
    //Draw Players
    const drawPlayers = (s)=>{
      for(let i = 0; i < s.count; i++){
        ctx.beginPath();
        ctx.arc(s.players[i].x, 
          s.players[i].y, 
          s.players[i]._radius, 
          0, 2*Math.PI);
        ctx.fillStyle = s.players[i]._color;
        ctx.fill();
      }
    };
    const updateCanavs = ()=>{
      //Reset Map
      ctx.clearRect(
        ctx.lineWidth/2, 
        ctx.lineWidth/2, 
        server._width+(gc.BORDER_LINE_WIDTH*2), 
        server._height+(gc.BORDER_LINE_WIDTH*2));
      //Redraw Border
      drawBorder(server._width, server._height);
      //Redraw Pellets
      drawPellets(server);
      //Redraw Viruses
      drawViruses(server);
      //Redraw Players
      drawPlayers(server);
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
        //If mouse moved, send new data
        console.log("0");
        sendMouse();
        if(frame === 59){
          frame = 0;
        }
        frame++;
        window.requestAnimationFrame(step);
      }
      window.requestAnimationFrame(step);
    }
    const sendMouse = ()=>{
      //Send Mouse Moved
      message.type = "mousemove";
      message.content = mouseCoords;
      ws.send(JSON.stringify(message));
    }
  }
}
      