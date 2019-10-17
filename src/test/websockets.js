const websockets = () =>{
  const m = require("./main");
  const b = require("./buttons");
  const bf = require("./botfrenzy");
  let playerId = "";
  if(b.botfrenzy.isActive){
    const ws = new WebSocket("ws://localhost:8080");
    window.onbeforeunload = ()=>{
      ws.onclose();
    }
    //console.log(ws);
    ws.onopen = () =>{
      ws.send("CLIENT-SIDE: OPENED");
      m.menu.style.display = "none";
    };
    ws.onmessage = msg =>{
      let data = JSON.parse(msg.data);
      if(data.id === "pellets"){
        //Draw Canvas
        bf.drawCanvas(data);
      } else if (data.playerList[0].id === "player"){
        const assignPlayerId = ()=>{
          playerId = data.playerList[data.playerList.length - 1].clientId;
        };
        if(!playerId){
          assignPlayerId();
        }
        //Spawn Player
        bf.renderPlayers(data);
      } else {
        //Log the message
        console.log(`SERVER MESSAGE: ${data}`);
        b.buttons = false;
      }
    };
    ws.onclose = () =>{
      ws.send(playerId);
    }
  }      
};
module.exports = {
  w: websockets
};