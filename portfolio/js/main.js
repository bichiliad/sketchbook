/*
 * @flow
 */


/* Takes an element, returns its distance from the top of the page */
function offset(elem) {
  var x = 0;
  while (elem) {
    x += elem.offsetTop;
    elem = elem.offsetParent;
  }
  return x;
}

/* Adds a paralax effect to an image element */
var parallaxImg = function(element) {
  window.addEventListener('scroll', function() {
    var top = window.scrollY;
    if (top <= 650) {
      var offset = (top / 650) * 50 - 50;
      element.style.top = offset + 'px';
    }
  });
};


$(document).ready(function() {


  var images = [
    document.getElementById('masthead-img'),
  ];
  images.map(parallaxImg);
});
