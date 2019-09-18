"use strict";

//Define: menu
var menu = document.getElementById("getMenu");
var menuH = menu.offsetHeight;
var menuW = menu.offsetWidth; //Define: resizeDiv & resizeMsg

var resizeDiv = document.createElement("div");
resizeDiv.setAttribute("style", "height:100%; width:100%; border:1px solid white; background-color:#a89f9e; text-align:center");
var resizeMsg = document.createElement("p");
resizeMsg.setAttribute("style", "font-family:Arial;");
resizeMsg.innerHTML = "If possible, please resize your window to at least 400 pixels high and 600 pixels wide!";
resizeDiv.appendChild(resizeMsg); //Define: container

var container = document.getElementById("getContainer"); //gets window dimension values

var getWin = function getWin() {
  var wH = window.innerHeight;
  var wW = window.innerWidth; //Check page requirements

  if (wH < 400 || wW < 600) {
    dispRes();
  } else {
    menu.style.display = "block"; //Removes resizeDiv

    if (container.children[1]) {
      container.removeChild(resizeDiv);
    }
  }
}; //displays resizeDiv


var dispRes = function dispRes() {
  menu.style.display = "none"; //Appends resizeDiv

  if (container.children.length === 1) {
    container.appendChild(resizeDiv);
  }
};

window.addEventListener("resize", getWin);