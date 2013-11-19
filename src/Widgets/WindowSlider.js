
// Check if relevant namespaces exist - or create them.
var Samotraces = Samotraces || {};
Samotraces.Widgets = Samotraces.Widgets || {};

/**
 * @class Generic Widget for visualising a temporal slider.
 * @author Benoît Mathern
 * @constructor
 * @mixes Samotraces.Widgets.Widget
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
Samotraces.Widgets.WindowSlider = function(html_id,wide_window,slider_window) {
	// WidgetBasicTimeForm is a Widget
	Samotraces.Widgets.Widget.call(this,html_id);

	this.add_class('WidgetBasicWindowSlider');
	Samotraces.Lib.WindowState.addEventListener('resize',this.draw.bind(this));

	this.wide_window = wide_window;
	this.wide_window.addEventListener('updateTimeWindow',this.draw.bind(this));
	this.slider_window = slider_window;
	this.slider_window.addEventListener('updateTimeWindow',this.draw.bind(this));

	this.slider_offset = 0;
	this.width = 0;

	this.init_DOM();
	// update slider's position
	this.draw();
};

Samotraces.Widgets.WindowSlider.prototype = {
	init_DOM: function() {

		// create the slider
		this.slider_element = document.createElement('div');
		this.element.appendChild(this.slider_element);

		// hand made drag&drop
		// event listeners
		var widget = this;
		Samotraces.Lib.addBehaviour('changeTimeOnDrag',this.slider_element,{
				onUpCallback: function(delta_x) {
					var time_delta = delta_x*widget.wide_window.get_width()/widget.element.clientWidth;
					widget.slider_window.translate(time_delta);	
				},
				onMoveCallback: function(offset) {
					widget.slider_element.style.left = widget.slider_offset+offset+'px';
				},
			});
		Samotraces.Lib.addBehaviour('zommOnScroll',this.element,{timeWindow: this.slider_window});
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


};


