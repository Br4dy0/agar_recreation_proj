//Create Pellets Class
class Pellets{
  constructor(mass){
    this.id = "pellets";
    this.limit = 32500;
    this.array = null;
    this.count = null;
    this.radius = null;
    this._mass = mass;
  }
  get getCount(){
    return this.getPos().count;
  }
  get getArray(){
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
    while(count < this.limit){
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
class Viruses{
  constructor(limit){
    this.id = "virus";
    this.strokeSize = 2;
    this.array = [];
    this._limit = limit;
  }
}
//Create Player Class
class Player{
  constructor(mass){
    this.id = "player";
    this.render = {
      v:300,
      xmin:null,
      ymin:null,
      xmax:null,
      ymax:null,
      searchList:[],
      info:{
        id:"render",
        objects:[]
      }
    };
    this.cells = [
      {id:null, x:null, y:null, c:null, t:3, r:null, m:mass}
    ];
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
    return clientId;
  }
  get playerColor(){
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
    this.pId = 0;
    this.players = [];
    this._width = width;
    this._height = height;
    this._limit = limit;
  }
}
/* Calculate Radius */
const radCalc = (mass) =>{
  return Math.pow(6*mass/Math.PI, 1/2).toFixed(4);
}
/* Server */
const server = new ServerInfo(15000, 15000, 100);
/* Pellets */
const pellets = new Pellets(3);
pellets.array = pellets.getArray;
pellets.count = pellets.getCount;
pellets.radius = Number(radCalc(3));
/* Virus */
const viruses = new Viruses(50);
const staticSearchList = (msg)=>{
  const p = getPlayer(msg.clientId);
  const rd = getRenderDistance(p, "uSL");
  //Reset List
  p.render.searchList = [];
  //Find all pellets in search range
  pellets.array.forEach(el=>{
    if(el.x + pellets.radius < rd.xmin - 150){
      return;
    }else if(el.y + pellets.radius < rd.ymin - 150){
      return;
    }else if(el.x - pellets.radius > rd.xmax + 150){
      return;
    }else if(el.y - pellets.radius > rd.ymax + 150){
      return;
    }else{
      p.render.searchList.push(el);
    }
  });
  //console.log(p.render.searchList);
}
const playerSearchList = (p)=>{
  //Find all players in render range
  server.players.forEach(el=>{
    el.cells.forEach(nel=>{
      if(nel.x + nel.r < p.render.xmin - 150){
        return;
      }else if(nel.y + nel.r < p.render.ymin - 150){
        return;
      }else if(nel.x - nel.r > p.render.xmax + 150){
        return;
      }else if(nel.y - nel.r > p.render.ymax + 150){
        return;
      }else{
        p.render.searchList.push(nel);
      }
    });
  });
};
const getRenderDistance = (p, sender)=>{
  //console.log(`XMin: ${p.render.xmin} / YMin: ${p.render.ymin} / XMax: ${p.render.xmax} / YMax: ${p.render.ymax}`);
  if(sender === "rO" || "pS"){
    let sX, sY, bX, bY;
    p.cells.forEach(cell=>{
      if((cell.x - cell.r) < sX || !sX){
        sX = (cell.x - cell.r)
      }
      if((cell.y - cell.r) < sY || !sY){
        sY = (cell.y - cell.r)
      }
      if((cell.x + cell.r) > bX || !bX){
        bX = (cell.x + cell.r)
      }
      if((cell.y + cell.r) > bY || !bY){
        bY = (cell.y + cell.r)
      }
    });
    //Update render values
    p.render.xmin = (sX - p.render.v).toFixed(4);
    p.render.ymin = (sY - p.render.v).toFixed(4);
    p.render.xmax = (bX + p.render.v).toFixed(4);
    p.render.ymax = (bY + p.render.v).toFixed(4);
    //console.log(`B: ${p.render.ymin} / R: ${p.render.v}`);
    return {
      xmin: p.render.xmin,
      ymin: p.render.ymin,
      xmax: p.render.xmax,
      ymax: p.render.ymax
    }
  }else{
    //Return latest render values
    return {
      xmin: p.render.xmin,
      ymin: p.render.ymin,
      xmax: p.render.xmax,
      ymax: p.render.ymax
    }
  }
};
const renderObjects = (p)=>{
  //console.log(p);
  const rd = getRenderDistance(p, "rO");
  //Reset Rendered Objects
  p.render.info.objects = [];
  //Iterate Through the search list
  p.render.searchList.forEach(el=>{
    let radius;
    if(el.r){
      radius = el.r;
    }else{
      radius = pellets.radius;
      el.t = 1;
    }
    if(el.x + radius < rd.xmin){
      return;
    }else if(el.y + radius < rd.ymin){
      return;
    }else if(el.x - radius > rd.xmax){
      return;
    }else if(el.y - radius > rd.ymax){
      return;
    }else{
      p.render.info.objects.push(el);
    }
  });
  //console.log(p.render.info.objects);
  return sortObjects(p.render.info);
}
/* On New Player */
const playerSpawn = ()=>{
  /* Player */
  //let m = Math.floor(Math.random() * 525) + 75;
  const player = new Player(75);
  player.cells[0].x = player.position.x;
  player.cells[0].y = player.position.y;
  player.cells[0].c = player.playerColor;
  player.cells[0].r = Number(radCalc(75));
  let i = server.pId;
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
  player.cells[0].id = player.clientId + ext + i;
  /* Server */
  server.players.forEach(p=>{
    p.render.searchList.push(player.cells[0]);
  });
  server.players.push(player);
  server.count++;
  server.pId++;
  //Get render values
  getRenderDistance(player, "pS");
  //Update Search List
  staticSearchList({clientId:player.cells[0].id});
  //Get the rendered Objects 
  let getObjects = renderObjects(player);
  return [
  {
    id: player.id, 
    clientId: player.cells[0].id
  },
    getObjects
  ];
};
/* On Cell Move */
const playerMovement = (msg)=>{
  let p = getPlayer(msg.clientId);
  //Get Players in search range
  setTimeout(()=>{
    playerSearchList(p);
  }, 5);
  p.cells.forEach(c=>{
    //console.log(`C1: ${c}`);
    //Get Offset
    let offsetX = c.x - msg.content.x;
    let offsetY = c.y - msg.content.y;
    //Get Direction
    let direction = (Math.abs((Math.atan(offsetX/offsetY)*(180/Math.PI)))/90*100).toFixed(4);
    //Move player Left or Right
    let dirX, dirY;
    if(offsetX > 0) dirX = -1;
    else if(offsetX === 0) dirX = 0;
    else dirX = 1;
    //Move player Up or Down
    if(offsetY > 0) dirY = -1;
    else if(offsetY === 0){
      direction = 0;
      dirY = 0;
    }
    else dirY = 1;
    //Calculate cell speed
    let distance = Math.pow((Math.pow(offsetX, 2) + Math.pow(offsetY, 2)), .5);
    let speed = 1.5 * Math.pow(c.m, -.0439);
    let maxDist = c.r + 50, force;
    //Get the force of the cell
    if(distance >= maxDist) force = 1;
    else if(distance > 0.00001) force = distance / maxDist;
    else force = 0;
    let fX = (direction * speed * force * dirX) / 100;
    let fY = ((100 - direction) * speed * force * dirY) / 100;
    //console.log(`FX: ${fX} / FY: ${fY}`);
    c.x += fX;
    c.x = Number(c.x.toFixed(4));
    c.y += fY;
    c.y = Number(c.y.toFixed(4));
  });
  //console.log(`C2: ${p.render.info.objects}`);
  //console.log(p.render.info.objects);
  //Get Rendered Objects
  setTimeout(()=>{
    renderObjects(p);
  }, 5);
  return p.render.info;
};
/* On Player Leave */
const playerLeft = (msg)=>{
  setTimeout(()=>{
    let index = server.players.indexOf(getPlayer(msg.clientId));
    server.players.splice(index, 1);
    server.count--;
  }, 5000);
};
/* Sorts Objects */
const sortObjects = (p)=>{
  p.objects.sort((c, d)=>{
    //console.log(`CM: ${JSON.stringify(c)} / DM: ${JSON.stringify(d)}`);
    if(c.m && d.m){
      if(c.m < d.m) return -1;
      if(c.m > d.m) return 1;
      return 0;
    }else if(!c.m || !d.m){
      if(!c.m && d.m) return -1;
      if(c.m && !d.m) return 1;
      return 0;
    }else{
      return -1;
    }
  });
  return p;
};
/* Get Current Player */
const getPlayer = (id)=>{
  let yourPlayer;
   server.players.forEach(x=>{
    if(x.cells[0].id === id){
      yourPlayer = x;
    }
  });
  return yourPlayer;
}
//Send static info to client
const sendInfo = ()=>{
  return [{
    id: server.id,
    width: server._width,
    height: server._height
  },{
    id:pellets.id,
    r:pellets.radius,
  }]
}
module.exports = {
  server: server,
  sendInfo: sendInfo,
  staticSearchList: staticSearchList,
  playerSearchList: playerSearchList,
  playerSpawn: playerSpawn,
  playerMovement: playerMovement,
  playerLeft: playerLeft
}