/**
 * @mixin
 * @requires jQuery framework (see <a href="http://jquery.com">jquery.com</a>)
 * @requires jQuery Mouse Wheel plugin (see <a href="https://github.com/brandonaaron/jquery-mousewheel">Mouse Wheel plugin</a>)
 * @description
 * All widgets should inherit from this Samotraces.UI.Widgets.Widget.
 * 
 * In order to use create a widget that inherits from the 
 * Widget class, one mush include the following code in 
 * the constructor of their widget.
 * <code>
 * </code>
 *
 * @property {string} id Id of the HTML element the
 * Widget is attached to.
 * @property {HTMLElement} element HTML element the
 * Widget is attached to.
 */
Samotraces.UI.Widgets.Widget = (function() {
	/**
	 * Adds the given class to the HTML element to which
	 * this Widget is attached to.
	 * @memberof Samotraces.Widgets.Widget.prototype
	 * @public
	 * @method
	 * @param {string} class_name Name of the class to add
	 */
	function add_class(class_name) {
		this.element.className += ' '+class_name;
	}

	function unload() {
		this.element.className = '';
//		this.element.
	}
	/**
	 * Creates a new behaviour (interaction possibility)
	 * with the widget.
	 * Two behaviours are implemented so far:
	 * 1. 'changeTimeOnDrag'
	 * 2. 'zommOnScroll'
	 *
	 * 1. 'changeTimeOnDrag' behaviour allows to change
	 * a {@link Samotraces.Lib.Timer} on a drag-n-drop like event
	 * (JavaScript 'mousedown', 'mousemove', 'mouseup' and 'mouseleave'
	 * events). This allows to change the current time by dragging
	 * a trace visualisation or a slider for instance.
	 *
	 * 2. 'changeTimeOnDrag' behaviour allows to change
	 * a {@link Samotraces.Lib.TimeWindow} on a mouse scroll event
	 * (JavaScript 'wheel' event)
	 *
	 * @memberof Samotraces.Widgets.Widget.prototype
	 * @public
	 * @method
	 * @param {String} behaviourName Name of the behaviour
	 *     ('changeTimeOnDrag' or 'zommOnScroll'). See description above.
	 * @param {HTMLElement} eventTargetElement HTML Element on which
	 *     an eventListener will be created (typically, the element you
	 *     want to interact with).
	 * @param {Object} opt Options that vary depending on the
	 *     selected behaviour.
	 * @param {Function} opt.onUpCallback
	 *    (for 'changeTimeOnDrag' behaviour only)
	 *    Callback that will be called when the 'mouseup' event will be
	 *    triggered. The argument delta_x is passed to the callback
	 *    and represents the offset of the x axis in pixels between the
	 *    moment the mousedown event has been triggered and the moment
	 *    the current mouseup event has been triggered.
	 * @param {Function} opt.onMoveCallback
	 *    (for 'changeTimeOnDrag' behaviour only)
	 *    Callback that will be called when the 'mousemove' event will be
	 *    triggered. The argument delta_x is passed to the callback
	 *    and represents the offset of the x axis in pixels between the
	 *    moment the mousedown event has been triggered and the moment
	 *    the current mousemove event has been triggered.
	 * @param {Samotraces.Lib.TimeWindow} opt.timeWindow
	 *    (for 'zommOnScroll' behaviour only)
	 *    {@link Samotraces.Lib.TimeWindow} object that will
	 *    be edited when the zoom action is produced.
	 */
	function add_behaviour(behaviourName,eventTargetElement,opt) {

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
					var coef = Math.pow(0.8,e.deltaY);
					opt.timeWindow.zoom(coef);
	//				opt.onWheelCallback.call(opt.bind,coef);
					e.preventDefault();
					return false;
				};
				$(eventTargetElement).mousewheel(wheel);
				break;
			default:
				break;
		}
	}
	return function(id) {
		// DOCUMENTED ABOVE
		this.id = id;
		this.element = document.getElementById(this.id);
		this.add_class = add_class;
		this.add_behaviour = add_behaviour;

		// call method
		this.add_class('Widget');
		return this;
	};
})();

