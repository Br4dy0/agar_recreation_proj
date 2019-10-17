const m = require("./main");
const gc = require("../canvas.global");
const ctx = m.canvas.getContext("2d");
exports.drawCanvas = (pel)=>{
  //Draw Border
  const drawBorder = (width, height) =>{
    ctx.lineWidth = gc.BORDER_LINE_WIDTH * gc.CANVAS_ZOOM;
    ctx.strokeStyle = gc.BORDER_STROKE_COLOR;
    ctx.strokeRect(ctx.lineWidth/2, ctx.lineWidth/2, width, height);
  };
  //Draw Pellets
  const drawPellets = () =>{
    for(let i = 0; i < pel.array.length; i++){
      ctx.beginPath();
      ctx.arc(pel.array[i].x, pel.array[i].y, pel.size, 0, 2*Math.PI);
      ctx.fillStyle = pel.color;
      ctx.fill();
    }
  };
  //Draw Viruses
  const drawViruses = () =>{
    console.log("Viruses Coming Soon!");
  };
  drawBorder(gc.CANVAS_WIDTH, gc.CANVAS_HEIGHT);
  drawPellets();
  drawViruses();
};
//Render Players
exports.renderPlayers = (p)=>{
  for(let i = 0; i < p.playerCount; i++){
    ctx.beginPath();
    ctx.arc(p.playerList[i].x, p.playerList[i].y, p.playerList[i].size, 0, 2*Math.PI);
    ctx.fillStyle = p.playerList[i].color;
    ctx.fill();
  }
};
exports.onChange = ()=>{
  ctx.clearRect(gc.BORDER_LINE_WIDTH / 2, gc.BORDER_LINE_WIDTH / 2, gc.CANVAS_WIDTH, gc.CANVAS_HEIGHT)
}