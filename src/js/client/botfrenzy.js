const m = require("./main");
const gc = require("../canvas.global");
const ctx = m.canvas.getContext("2d");
let currPellets = null;
let currPlayers = null;
//Draw Border
const drawBorder = (width, height) =>{
  ctx.lineWidth = gc.BORDER_LINE_WIDTH * gc.CANVAS_ZOOM;
  ctx.strokeStyle = gc.BORDER_STROKE_COLOR;
  ctx.strokeRect(ctx.lineWidth/2, ctx.lineWidth/2, width, height);
};
//Draw Pellets
exports.drawPellets = (pel) =>{
  if(pel){
    for(let i = 0; i < pel.array.length; i++){
      ctx.beginPath();
      ctx.arc(pel.array[i].x, 
        pel.array[i].y, 
        pel.size, 
        0, 2*Math.PI);
      ctx.fillStyle = pel.color;
      ctx.fill();
    }
  }
};
//Draw Viruses
exports.drawViruses = () =>{
  console.log("Viruses Coming Soon!");
};
//Draw Players
exports.drawPlayers = (p)=>{
  if(p){
    for(let i = 0; i < p.playerCount; i++){
      ctx.beginPath();
      ctx.arc(p.playerList[i].x, 
        p.playerList[i].y, 
        p.playerList[i].size, 
        0, 2*Math.PI);
      ctx.fillStyle = p.playerList[i].color;
      ctx.fill();
    }
  }
};
exports.updateCanavs = (pellets, players)=>{
  if(pellets) currPellets = pellets;
  if(players) currPlayers = players;
  const step = (timestamp)=>{
    let start = null;
    if (!start) start = timestamp;
    let progress = timestamp - start;

    if (progress <= gc.FPS_60) {
      //Reset Map
      ctx.clearRect(gc.BORDER_LINE_WIDTH / 2, gc.BORDER_LINE_WIDTH / 2, gc.CANVAS_WIDTH, gc.CANVAS_HEIGHT);
      //Redraw Border
      drawBorder(gc.CANVAS_WIDTH, gc.CANVAS_HEIGHT);
      //Redraw Pellets
      (pellets) ? this.drawPellets(pellets) : this.drawPellets(currPellets);
      //Redraw Viruses
      this.drawViruses();
      //Redraw Players
      (players) ? this.drawPlayers(players) : this.drawPlayers(currPlayers);
      //Reset
      console.log("HI");
      window.requestAnimationFrame(step);
    }
  }
  window.requestAnimationFrame(step);
}
drawBorder(gc.CANVAS_WIDTH, gc.CANVAS_HEIGHT);