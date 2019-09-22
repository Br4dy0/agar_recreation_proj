module.exports = websockets = () =>{
  //Global Variables
  const mlButtons = document.getElementsByClassName("menu-left-list-buttons");
  let topButtons = [];
  let botButtons = [];
  let colorFade;
  //top button down
  const topDownButton = e =>{
    let x = e.target;
    topButtons.forEach((z)=>{
      callOtherButtons(e, z);
    });
    callFadeButton(e, x);
  }
  //bot button down
  const botDownButton = e =>{
    let x = e.target;
    botButtons.forEach((z)=>{
      callOtherButtons(e, z);
    });
    callFadeButton(e, x);
  }
  const callFadeButton = (e, x)=>{
    //Stop the fade on each click
    clearInterval(colorFade);
    if(e.target === x){
      x.style.color = "gray";
      x.style.fontWeight = "bold";
      let sRGB = 0;
      let eRGB = 765;
      let getInc = eRGB / 100;
      c = 1;
      //If the button is not already fading, start the fade 
      if(!x.selected){
        x.selected = true;
        x.disabled = true;
        colorFade = setInterval(()=>{
          if(c < 101){
            let nRGB = sRGB + getInc;
            nRGB /= 3;
            x.style.backgroundColor = `rgb(${nRGB}, ${nRGB}, ${nRGB})`;
            sRGB = parseFloat((nRGB * 3).toFixed(3));
            c++;
          } else {
            clearInterval(colorFade);
          }
        }, 1);
      }
    }
  }
  const callOtherButtons = (e, z) =>{
    if(e.target != z){
      //Set other buttons to default
      z.style.color = "white";
      z.style.backgroundColor = "black";
      z.style.fontWeight = "normal";
      z.selected = false;
      z.disabled = false;
    }
  }
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