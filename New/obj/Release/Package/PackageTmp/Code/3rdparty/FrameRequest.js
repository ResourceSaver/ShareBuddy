function RequestFrame() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame
     || function (/* function */ callback, /* DOMElement */ element) {
         window.setTimeout(callback, 1000 / 60)
     };
}

function StandAloneDetectorIOS() {
    return ("standalone" in window.navigator) && window.navigator.standalone;
}

function StandAloneDetectorAndroid() {
    if (screen.height > screen.width && document.documentElement.clientWidth > document.documentElement.clientHeight)  return true;
    else return navigator.standalone = navigator.standalone || (screen.height - document.documentElement.clientHeight < 80);
}