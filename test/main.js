//Define: menu
let menu = document.getElementById("getMenu");
let menuH = 455;
let menuW = 610;
//Define: menu objects
let menuLeft = document.getElementById("menuLeftPanel");
let menuMiddle = document.getElementById("menuMidPanel");
let menuRight = document.getElementById("menuRightPanel");
//Define: container
let container = document.getElementById("getContainer"); 
//resizeMenu
const resizeMenu  = () =>{
  let wH = window.innerHeight;
  let wW = window.innerWidth; 
  let scaleX = wW / menuW;
  let scaleY = wH / menuH;
  let menuT = `translate(${wW / 2 - 305}px, ${wH / 2 - 227.5}px)`;
  menu.style.transformOrigin = "50% 50%";
  //container.style.width = wW+"px";
  //container.style.height = wH+"px";
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
};
//Event Listeners
document.addEventListener("DOMContentLoaded", resizeMenu);
window.addEventListener("resize", resizeMenu);