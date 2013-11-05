
// Check if relevant namespaces exist - or create them.
var Samotraces = Samotraces || {};
Samotraces.Widgets = Samotraces.Widgets || {};
Samotraces.Widgets.Basic = Samotraces.Widgets.Basic || {};

/**
 * @class Generic Widget for visualising the current time.
 * @author Benoît Mathern
 * @constructor
 * @augments Samotraces.Widgets.Widget
 * @description
 * Samotraces.Widgets.d3Basic.TimeSlider is a generic
 * Widget to visualise the current time in a temporal window
 *
 * @param {String}	divId
 *     Id of the DIV element where the widget will be
 *     instantiated
 * @param time_window
 *     TimeWindow object -> representing the wide window
 *     (e.g., the whole trace)
 * @param timer
 *     Timeer object -> containing the current time
 */
Samotraces.Widgets.Basic.TimeSlider = function(html_id,time_window,timer) {
	// WidgetBasicTimeForm is a Widget
	Samotraces.Widgets.Widget.call(this,html_id);

	this.add_class('WidgetBasicTimeSlider');
	Samotraces.Objects.WindowState.addObserver(this);

	this.timer = timer;
	timer.addObserver(this);

	this.time_window = time_window;
	time_window.addObserver(this);

	// update slider style
	this.slider_offset = 0;

	this.init_DOM();
	// update slider's position
	this.draw();

};

Samotraces.Widgets.Basic.TimeSlider.prototype = {
	init_DOM: function() {
		// create the slider
		this.slider_element = document.createElement('div');
		this.element.appendChild(this.slider_element);

		// hand made drag&drop
		this.slider_element.addEventListener('mousedown',this.build_callback('mousedown'));
	},

	update: function(message,object) {
		switch(message) {
			case 'updateWindowStartTime':
				start = object;
				this.draw();	
				break;
			case 'updateWindowEndTime':
				end = object;
				this.draw();	
				break;
			case 'updateTime':
				time = object;
				this.draw();	
				break;
			case 'resize':
				this.draw();
				break;
			default:
				break;
		}
	},
	draw: function() {
		if(this.time_window.start < this.timer.time && this.timer.time < this.time_window.end) {
			this.slider_offset = (this.timer.time - this.time_window.start)*this.element.clientWidth/this.time_window.get_width();
//			console.log(this.slider_offset);
			this.slider_element.setAttribute('style','left:'+this.slider_offset+'px;');
			this.slider_element.setAttribute('display','block');
		} else {
			this.slider_element.setAttribute('display','none');
		}
	},

	build_callback: function(event) {
		// build the callbacks functions once and for all
		if(this.callbacks === undefined) {
			// create a closure for the callbacks
			var mousedown,mouseup,mousemove;
			var init_client_x;
			var widget = this;
			(function() {
				mousedown = function(e) {
				//	console.log('mousedown');
					e.preventDefault();
					init_client_x = e.clientX;
					widget.element.addEventListener('mousemove',mousemove);
					widget.element.addEventListener('mouseup',mouseup);
					widget.element.addEventListener('mouseleave',mouseup);
					return false;
				};
				mouseup = function(e) {
				//	console.log('mouseup');
					if(init_client_x !== undefined) {
						var new_time = widget.timer.time + (e.clientX - init_client_x)*widget.time_window.get_width()/widget.element.clientWidth;
						// replace element.getSize() by element.clientWidth?
						widget.timer.set(new_time);
						widget.element.removeEventListener('mousemove',mousemove);
						widget.element.removeEventListener('mouseup',mouseup);
						widget.element.removeEventListener('mouseleave',mouseup);
					}
					return false;
				};
				mousemove = function(e) {
				//	console.log('mousemove');
					var offset = widget.slider_offset + e.clientX - init_client_x;
					widget.slider_element.setAttribute('style','left: '+offset+'px;');
					return false;
				};

			})();
			// save the functions in the this.callbacks attribute
			this.callbacks = {
				mousedown: mousedown,
				mouseup: mouseup,
				mousemove: mousemove,
			};
		}
		return this.callbacks[event];
	}
};


