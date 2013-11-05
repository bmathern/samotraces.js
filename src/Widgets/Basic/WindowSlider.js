
// Check if relevant namespaces exist - or create them.
var Samotraces = Samotraces || {};
Samotraces.Widgets = Samotraces.Widgets || {};
Samotraces.Widgets.Basic = Samotraces.Widgets.Basic || {};

/**
 * @class Generic Widget for visualising a temporal slider.
 * @author Benoît Mathern
 * @constructor
 * @augments Samotraces.Widgets.Widget
 * @description
 * Samotraces.Widgets.d3Basic.WindowSlider is a generic
 * Widget to visualise a temporal window
 *
 * @param {String}	divId
 *     Id of the DIV element where the widget will be
 *     instantiated
 * @param wide_window
 *     TimeWindow object -> representing the wide window
 *     (e.g., the whole trace)
 * @param slider_window
 *     TimeWindow object -> representing the small window
 *     (e.g., the current time window being visualised with another widget)
 */
Samotraces.Widgets.Basic.WindowSlider = function(html_id,wide_window,slider_window) {
	// WidgetBasicTimeForm is a Widget
	Samotraces.Widgets.Widget.call(this,html_id);

	this.add_class('WidgetBasicWindowSlider');
	Samotraces.Objects.WindowState.addObserver(this);

	this.wide_window = wide_window;
	wide_window.addObserver(this);
	this.slider_window = slider_window;
	slider_window.addObserver(this);

	this.slider_offset = 0;
	this.width = 0;

	this.init_DOM();
	// update slider's position
	this.draw();
};

Samotraces.Widgets.Basic.WindowSlider.prototype = {
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
//		if(this.time_window.start < this.timer.time && this.timer.time < this.time_window.end) {
//toto = this.element;
//console.log(this.element);
			this.width = this.slider_window.get_width()/this.wide_window.get_width()*this.element.clientWidth;
		//	this.slider_element.setAttribute();
			this.slider_offset = (this.slider_window.start - this.wide_window.start)*this.element.clientWidth/this.wide_window.get_width();
		//	this.slider_element.setAttribute('style','display: block; width: '+this.width+'px; left: '+this.slider_offset+'px;');
			this.slider_element.style.display = 'block';
			this.slider_element.style.width = this.width+'px';
			this.slider_element.style.left = this.slider_offset+'px';

	//		this.slider_element.setAttribute('display','block');
//		} else {
//			this.slider_element.setStyle('display','none');
//		}
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
						var new_time = widget.slider_window.timer.time + (e.clientX - init_client_x)*widget.wide_window.get_width()/widget.element.clientWidth;
						widget.slider_window.timer.set(new_time);
						widget.element.removeEventListener('mousemove',mousemove);
						widget.element.removeEventListener('mouseup',mouseup);
						widget.element.removeEventListener('mouseleave',mouseup);
					}
					return false;
				};
				mousemove = function(e) {
				//	console.log('mousemove');
					var offset = widget.slider_offset + e.clientX - init_client_x;
		//			this.slider_element.setAttribute('style','display: block; width: '+this.width+'px; left: '+offset+'px;');
					widget.slider_element.style.left = offset+'px';
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


