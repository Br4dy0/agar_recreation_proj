//Create Pellets Class
class Pellets{
  constructor(radius, mass, limit){
    this.id = "pellets";
    this._array = [];
    this._count = 0;
    this._radius = radius;
    this._mass = mass;
    this._limit = limit;
  }
  get count(){
    return this.getPos().count;
  }
  get array(){
    return this.getPos().array;
  }
  getPos(){
    let array = [];
    let count = 0;
    const setCoords = ()=>{
      return {
        x: (Math.floor(Math.random() * 150100000) + 50000)/10000,
        y: (Math.floor(Math.random() * 150100000) + 50000)/10000
      }
    };
    while(count < this._limit){
      const position = setCoords();
      if(array.length === 0){
        array.push(position);
        count++;
      }else{
        array.every((pel)=>{
          if(pel.x !== position.x && pel.y !== position.y){  
            array.push(position);
            count++;
          }
        });
      }
    }
    return {
      array: array,
      count: count
    }
  }
}
//Create Virus Class
class Virus{
  constructor(limit){
    this.id = "virus";
    this.strokeSize = 2;
    this._limit = limit;
  }
}
//Create Player Class
class Player{
  constructor(radius, mass){
    this.id = "player";
    this.x = null;
    this.y = null;
    this._color = null;
    this._clientId = "";
    this._identifer = 0;
    this._radius = radius;
    this._mass = mass;
  }
  get position(){
    return this.getPosition();
  }
  getPosition(){
    let position = {
      x: (Math.floor(Math.random() * 4000000) + 50000)/10000,
      y: (Math.floor(Math.random() * 4000000) + 50000)/10000
    }
    return position;
  }
  get clientId(){
    return this.createId();
  }
  createId(){
    let clientId = "";
    const idFunction = () =>{
      for(let i = 0; i < 5; i++){
        let number = [];
        for(let i = 0; i < 10; i++){
          number.push(i);
        }
        const getNumber = Math.floor(Math.random()*number.length);
        const letter = 'abcdefghijklmnopqrstuvwxyz'.split('');
        const getLetter = Math.floor(Math.random() * letter.length);
        const pickOne = Math.floor(Math.random()*2);
        if(pickOne === 0){
          clientId += number[getNumber];
        }else{
          clientId += letter[getLetter].toUpperCase();
        }
      }
    }
    if(!clientId) idFunction();
    return clientId;
  }
  get color(){
    return this.setColor();
  }
  setColor(){
    const colors = ["red", "orange", "yellow", "green", "blue", "purple"];
    const pickColor = Math.floor(Math.random() * 6);
    return colors[pickColor];
  }
}
class ServerInfo{
  constructor(width, height, limit){
    this.id = "server";
    this.count = 0;
    this.identifier = 0;
    this.ids = [];
    this.pellets = [];
    this.viruses = [];
    this.players = [];
    this._width = width;
    this._height = height;
    this._limit = limit;
  }
}
/* Get Radius */
const settings = require("./server.bf.setting");
let playerMass = settings.mass(75);
let pelletMass = settings.mass(3);
//console.log(`Player Radius: ${playerMass}\nPellet Radius: ${pelletMass}`)
/* Pellets */
const pellets = new Pellets(pelletMass, 3, 32500);
pellets._array = pellets.array;
pellets._count = pellets.count;
/* Virus */
const viruses = new Virus(50);
/* On New Player */
const server = new ServerInfo(15000, 15000, 100);
let player;
const newPlayer = ()=>{
  /* Player */
  player = new Player(playerMass, 75);
  player.x = player.position.x;
  player.y = player.position.y;
  player._clientId = player.clientId;
  player._color = player.color;
  let i = server.identifier;
  let ext = "";
  switch (true){
    case (i >= 10):
      ext = "-000";
      break;
    case (i >= 100):
      ext = "-00";
      break;
    case (i >= 1000):
      ext = "-0";
      break;
    case (i >= 10000):
      ext = "-";
      break;
    default:
      ext = "-0000";
      break;
  }
  player._clientId += ext + i;
  /* Server */
  server.players.push(player);
  server.ids.push(player._clientId);
  server.count++;
  server.identifier++;
  return player;
};
/* Server */
server.pellets.push(pellets);
server.viruses.push(viruses);
/* On Player Move */
const playerMovement = (msg)=>{
  const offsetX = player.x - msg.content.x;
  const offsetY = player.y - msg.content.y;
  let qX, qY;
  if(offsetX > 0){
    qX = -1;
  }else{
    qX = 1;
  }
  if(offsetY > 0){
    qY = -1;
  }else{
    qY = 1;
  }
  const distance = settings.distance(offsetX, offsetY);
  let direction;
  if(offsetY === 0 && offsetX !== 0){
    direction = 90;
  }else if(offsetY === 0 && offsetX === 0){
    direction = "STOP";
  }else{
    direction = settings.direction(offsetX, offsetY);
  }
  const pace = settings.pace(distance, qX, qY, player._radius, player._mass, direction, player);
  server.players.forEach((p)=>{
    if(p._clientId === msg.clientId){
      p.x += pace.x;
      p.y += pace.y;
    }
  });
  //console.log(`PACE: {${pace.x}, ${pace.y}}`);
};
/* On Player Leave */
const playerLeft = (msg)=>{
  console.log(msg.content);
  server.ids.forEach(x=>{
    if(x === msg.content){
      const index = server.ids.indexOf(x);
      server.ids.splice(index, 1);
      server.players.splice(index, 1);
    }
  });
  server.count--;
};
module.exports = {
  server: server,
  newPlayer: newPlayer,
  playerMovement: playerMovement,
  playerLeft: playerLeft
}