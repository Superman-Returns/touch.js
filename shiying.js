function setrem() {
    var windowwidth = window.innerWidth;
    var newpx = (windowwidth / 750) * 100;
    $('html').css('fontSize', newpx);
}
setrem();
window.onresize = function () {
    setrem();
};