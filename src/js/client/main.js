//Get DOM Elements
const menu = document.getElementById("menuDiv");
const canvas = document.getElementById("cvs");
//Resize Event
const resize = () =>{
  //Resize Menu
  let wH = window.innerHeight;
  let wW = window.innerWidth;
  let scaleX = wW / 610;
  let scaleY = wH / 455;
  let menuT = `translate(${wW / 2 - 305}px, ${wH / 2 - 227.5}px)`;
  if(menu.style.display !== "none"){
    if (wH < 455 && wW < 610) {
      //Scale X and Y
      if(scaleX <= scaleY){
        menu.style.transform = `${menuT} scale(${scaleX})`;
      } else {
        menu.style.transform = `${menuT} scale(${scaleY})`;
      }
    } else if(wH < 455 && wW >= 610){
      //Scale Y
      menu.style.transform = `${menuT} scale(${scaleY})`;
    } else if(wH >= 455 && wW < 610){
      //Scale X
      menu.style.transform = `${menuT} scale(${scaleX})`;
    }else{
      //Set menu back to default
      menu.style.transform = `${menuT} scale(1)`;
    }
  }
  //Resize Canvas
  canvas.height = wH;
  canvas.width = wW;
}
module.exports = {
  menu: menu,
  canvas: canvas,
  resize: resize
};