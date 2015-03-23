
Samotraces.Behaviour.ZoomOnScroll = function(selector,timeWindow) {
  wheel = function(e) {
    var coef = Math.pow(0.8,e.deltaY);
    timeWindow.zoom(coef);
    e.preventDefault();
    return false;
  };
  $(selector).mousewheel(wheel);
};
