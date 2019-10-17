//Create Pellets object
let pellets = {
  id: "pellets",
  array: [],
  limit: 5000,
  size: 3,
  color: "red"
};
//Create Player object
let player = {
  id: "player",
  clientId: "",
  x: null,
  y: null,
  size: 50,
  color: null,
  cells:{}
};
//Create Virus object
let virus = {
  id: "virus",
  limit: 50,
  fillColor: "gray",
  strokeColor: "white",
  strokeSize: 2,
  size: 100
};
//Create Server Information object
let serverInfo = {
  playerCount: 0,
  playerLimit: 100,
  playerList: [],
  playerId: []
};
//Create the position of the pellets
const pelletsPosition = ()=>{
  let pelletsCreated = 0;
  const setPos = ()=>{
    return{
      x: (Math.floor(Math.random() * 150100000) + 50000)/10000,
      y: (Math.floor(Math.random() * 150100000) + 50000)/10000
    }
  }
  while(pelletsCreated < pellets.limit){
    const getPos = setPos();
    if(pellets.array.length === 0){
      pellets.array.push(getPos);
      pelletsCreated++;
    }else{
      pellets.array.every((pel)=>{
        if(pel.x !== getPos.x && pel.y !== getPos.y){  
          pellets.array.push(getPos);
          pelletsCreated++;
        }
      });
    }
  }
};
const createPlayer = ()=>{
  const createId = ()=>{
    for(let i = 0; i < 7; i++){
      let number = [];
      for(let i = 0; i < 10; i++){
        number.push(i);
      }
      const getNumber = Math.floor(Math.random()*10);
      const letter = 'abcdefghijklmnopqrstuvwxyz'.split('');
      const getLetter = Math.floor(Math.random() * letter.length);
      const pickOne = Math.floor(Math.random()*2);
      if(pickOne === 0){
        player.clientId += number[getNumber];
      }else{
        player.clientId += letter[getLetter].toUpperCase();
      }
    }
    serverInfo.playerId.push(player.clientId);
    console.log(player.clientId);
  };
  createId();
  const data = {
    x: (Math.floor(Math.random() * 4000000) + 50000)/10000,
    y: (Math.floor(Math.random() * 4000000) + 50000)/10000,
    colors: ["red", "orange", "yellow", "green", "blue", "purple"],
    pickColor: Math.floor(Math.random() * 6)
  };
  player.x = data.x;
  player.y = data.y;
  player.color = data.colors[data.pickColor];

  var playerData = {
    id: player.id,
    clientId: player.clientId,
    x: player.x,
    y: player.y,
    size: player.size,
    color: player.color
  };
  serverInfo.playerList.push(playerData);
  serverInfo.playerCount++;
  player.clientId = "";
};
pelletsPosition();
module.exports = {
  pel: pellets,
  p: player,
  cP: createPlayer,
  sI: serverInfo
};