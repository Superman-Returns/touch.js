let obj = {
  setRem() {
    var uiW = 750,
      winW = document.documentElement.clientWidth,
      rate = winW / uiW;
    document.documentElement.style.fontSize = rate * 100 + "px";
  },
}
export {
  obj
}
