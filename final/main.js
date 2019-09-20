"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.main = void 0;

var main = function main() {
  //Define: menu
  var menu = document.getElementById("getMenu");
  var menuH = 455;
  var menuW = 610; //resizeMenu

  var resizeMenu = function resizeMenu() {
    var wH = window.innerHeight;
    var wW = window.innerWidth;
    var scaleX = wW / menuW;
    var scaleY = wH / menuH;
    var menuT = "translate(".concat(wW / 2 - 305, "px, ").concat(wH / 2 - 227.5, "px)");

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
};

exports.main = main;