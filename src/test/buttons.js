//Global Variables
const mlButtons = document.getElementsByClassName("menu-left-list-buttons");
const web = require("./websockets");
let botfrenzy = {
  isActive: false
};
const buttons = () => {
  let topButtons = [];
  let botButtons = [];
  //top button down
  const topDownButton = e =>{
    let x = e.target;
    topButtons.forEach(y=>{
      (y != x) ? callOtherButtons(y) : callFadeButton(x);
    });
  };
  //bot button down
  const botDownButton = e =>{
    let x = e.target;
    botButtons.forEach(y=>{
      (y != x) ? callOtherButtons(y) : callFadeButton(x);
    });
  };
  const callFadeButton = (x)=>{
    //Stop the fade on each click
    if(x){
      x.style.color = "gray";
      x.style.fontWeight = "bold";
      let time = 0;
      let sRGB = 0;
      let eRGB = 765;
      let getInc = eRGB / 100;
      //If the button is not already fading, start the fade 
      if(!x.selected){
        x.selected = true;
        x.disabled = true;
        getWeb();
        const buttonFade = ()=>{
          if(x.selected && time < 100 && !botfrenzy.isActive){
            let nRGB = sRGB + getInc;
            nRGB /= 3;
            x.style.backgroundColor = `rgb(${nRGB}, ${nRGB}, ${nRGB})`;
            sRGB = parseFloat((nRGB * 3).toFixed(3));
            time++;
          } else {
            clearInterval(buttonFade);
          }
        }
        setInterval(buttonFade, 1);
      }
    }
  };
  const callOtherButtons = (z) =>{
    //Set other buttons to default
    z.style.color = "white";
    z.style.backgroundColor = "black";
    z.style.fontWeight = "normal";
    z.selected = false;
    z.disabled = false;
  };
  const getWeb = ()=>{
    //Websocket Code
    if(topButtons[0].selected && botButtons[0].selected){
      botfrenzy.isActive = true;
      web.w();
    }
  };
  //adds event listeners
  for(let i = 0; i < mlButtons.length; i++){
    if(i < 3){
      topButtons.push(mlButtons[i]);
      mlButtons[i].addEventListener("mousedown", topDownButton);
    } else {
      botButtons.push(mlButtons[i]);
      mlButtons[i].addEventListener("mousedown", botDownButton);
    }
  }
};
module.exports = {
  buttons: buttons,
  botfrenzy: botfrenzy
};