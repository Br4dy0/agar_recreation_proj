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
      let pellets = null;
      let players = null;
      if(data.id === "pellets"){
        //Draw Canvas
        pellets = data;
        bf.drawPellets(pellets);
        bf.updateCanavs(pellets, null);
      } else if (data.playerList[0].id === "player"){
        players = data;
        const assignPlayerId = ()=>{
          playerId = players.playerList[players.playerList.length - 1].clientId;
        };
        if(!playerId){
          assignPlayerId();
        }
        //Spawn Player
        bf.drawPlayers(players);
        bf.updateCanavs(null, players);
      } else {
        //Log the message
        console.log(`SERVER MESSAGE: ${data}`);
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