const m = require("./main");
const b = require("./buttons");
document.addEventListener("DOMContentLoaded", m.resize);
window.addEventListener("load", b.buttons);
window.addEventListener("resize", m.resize);
