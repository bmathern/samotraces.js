
Samotraces.Behaviour.TranslateTimeWindowOnHorizontalDrag = function(selector,tw,pixelToTimeCallback,mouseMoveCallback) {
  var mousedown,mouseup,mousemove;
  var init_client_x;
  mousedown = function(e) {
  //  console.log('mousedown');
    init_client_x = e.clientX;
    e.target.addEventListener('mousemove',mousemove);
    e.target.addEventListener('mouseup',mouseup);
    e.target.addEventListener('mouseleave',mouseup);
    return false;
  };
  mouseup = function(e) {
  //  console.log('mouseup');
    if(init_client_x !== undefined) {
      var delta_x = (e.clientX - init_client_x);
      var delta_t = delta_x * pixelToTimeCallback();
      tw.translate(-delta_t);
      e.target.removeEventListener('mousemove',mousemove);
      e.target.removeEventListener('mouseup',mouseup);
      e.target.removeEventListener('mouseleave',mouseup);
    }
    return false;
  };
  mousemove = (function() {
    if(mouseMoveCallback===void 0) {
      return function(e) {
        var delta_x = (e.clientX - init_client_x);
        return false;
      };
    } else { // if callback is defined...
      return function(e) {
        var delta_x = (e.clientX - init_client_x);
        mouseMoveCallback(delta_x);
        return false;
      };
    }
  })();
  $(selector).on('mousedown',mousedown);
};
