
var Samotraces = Samotraces || {};
Samotraces.Lib = Samotraces.Lib || {};

Samotraces.Lib.addBehaviour = function(behaviourName,eventTargetElement,opt) {

	switch(behaviourName) {
		case 'changeTimeOnDrag':
			var mousedown,mouseup,mousemove;
			var init_client_x;
			mousedown = function(e) {
			//	console.log('mousedown');
				init_client_x = e.clientX;
				eventTargetElement.addEventListener('mousemove',mousemove);
				eventTargetElement.addEventListener('mouseup',mouseup);
				eventTargetElement.addEventListener('mouseleave',mouseup);
				return false;
			};
			mouseup = function(e) {
			//	console.log('mouseup');
				if(init_client_x !== undefined) {
					var delta_x = (e.clientX - init_client_x);
					opt.onUpCallback(delta_x);
					eventTargetElement.removeEventListener('mousemove',mousemove);
					eventTargetElement.removeEventListener('mouseup',mouseup);
					eventTargetElement.removeEventListener('mouseleave',mouseup);
				}
				return false;
			};
			mousemove = function(e) {
				var delta_x = (e.clientX - init_client_x);
				opt.onMoveCallback(delta_x);
				return false;
			};
			eventTargetElement.addEventListener('mousedown',mousedown);
			break;	
		case 'zommOnScroll':
			wheel = function(e) {
				var coef = Math.pow(0.8,-e.deltaY/3);
				opt.timeWindow.zoom(coef);
//				opt.onWheelCallback.call(opt.bind,coef);
				e.preventDefault();
				return false;
			};
			eventTargetElement.addEventListener('wheel',wheel);
			break;
		default:
			break;
	}

}

