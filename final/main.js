"use strict";

//Define: menu
var menu = document.getElementById("getMenu");
var menuH = 455;
var menuW = 610; //Define: menu objects

var menuLeft = document.getElementById("menuLeftPanel");
var menuMiddle = document.getElementById("menuMidPanel");
var menuRight = document.getElementById("menuRightPanel"); //Define: container

var container = document.getElementById("getContainer"); //resizeMenu

var resizeMenu = function resizeMenu() {
  var wH = window.innerHeight;
  var wW = window.innerWidth;
  var scaleX = wW / menuW;
  var scaleY = wH / menuH;
  var menuT = "translate(".concat(wW / 2 - 305, "px, ").concat(wH / 2 - 227.5, "px)");
  menu.style.transformOrigin = "50% 50%"; //container.style.width = wW+"px";
  //container.style.height = wH+"px";

  if (wH < 455 && wW < 610) {
    //Scale X and Y
    if (scaleX <= scaleY) {
      menu.style.transform = "".concat(menuT, " scale(").concat(scaleX, ")");
    } else {
      menu.style.transform = "".concat(menuT, " scale(").concat(scaleY, ")");
    }
  } else if (wH < 455 && wW >= 610) {
    //Scale Y
    menu.style.transform = "".concat(menuT, " scale(").concat(scaleY, ")");
  } else if (wH >= 455 && wW < 610) {
    //Scale X
    menu.style.transform = "".concat(menuT, " scale(").concat(scaleX, ")");
  } else {
    //Set menu back to default
    menu.style.transform = "".concat(menuT, " scale(1)");
  }
}; //Event Listeners


document.addEventListener("DOMContentLoaded", resizeMenu);
window.addEventListener("resize", resizeMenu);