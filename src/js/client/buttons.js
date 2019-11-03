//Global Variables
const getTopButtons = document.getElementsByClassName("menu-left-list-top-buttons");
const getBotButtons = document.getElementsByClassName("menu-left-list-bot-buttons");
const canvas = require("./canvas");
exports.botfrenzy = {
  isActive: false
};
exports.buttons = () => {
  let topButtons = [];
  let botButtons = [];
  let startFade = null;
  const fade = (x)=>{
    if(startFade){
      clearInterval(startFade);
    }
    //Stop the fade on each click
    if(x){
      x.style.color = "gray";
      x.style.fontWeight = "bold";
      let time = 0;
      let current = 0;
      let end = 765;
      let increment = end / 100;
      //If the button is not already fading, start the fade 
      if(!x.selected){
        x.selected = true;
        x.disabled = true;
        getWeb();
        const buttonFade = ()=>{
          if(time < 100){
            let next = (current + increment) / 3;
            x.style.backgroundColor = `rgb(${next}, ${next}, ${next})`;
            current = (next * 3);
            time++;
          }
        }
        if(x.selected && !this.botfrenzy.isActive){
          startFade = setInterval(buttonFade, 1);
        }
      }
    }
  };
  const reset = (z) =>{
    //Set other buttons to default
    z.selected = false;
    z.disabled = false;
    z.style.color = "white";
    z.style.backgroundColor = "black";
    z.style.fontWeight = "normal";
  };
  const top = (e)=>{
    topButtons.forEach(y=>{
      (y !== e.target) ? reset(y) : fade(y);
    });
  }
  const bot = (e) =>{
    botButtons.forEach(y=>{
      (y !== e.target) ? reset(y) : fade(y);
    });
  }
  const getWeb = ()=>{
    //Websocket Code
    if(topButtons[0].selected && botButtons[0].selected){
      this.botfrenzy.isActive = true;
      canvas.init();
    }
  };
  //AddEventListeners to buttons
  for(let i = 0; i < getTopButtons.length; i++){
    topButtons.push(getTopButtons[i]);
    getTopButtons[i].addEventListener("mousedown", top);
  }
  for(let i = 0; i < getBotButtons.length; i++){
    botButtons.push(getBotButtons[i]);
    getBotButtons[i].addEventListener("mousedown", bot);
  }
};