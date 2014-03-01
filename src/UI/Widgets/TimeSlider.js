/**
 * @summary Widget for visualising a time slider.
 * @class Widget for visualising a time slider.
 * @author Benoît Mathern
 * @constructor
 * @mixes Samotraces.UI.Widgets.Widget
 * @description
 * Samotraces.UI.Widgets.d3Basic.TimeSlider is a generic
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
Samotraces.UI.Widgets.TimeSlider = function(html_id,time_window,timer) {
	// WidgetBasicTimeForm is a Widget
	Samotraces.UI.Widgets.Widget.call(this,html_id);

	this.add_class('Widget-TimeSlider');
	$(window).resize(this.draw.bind(this));

	this.timer = timer;
	this.timer.on('timer:update',this.draw.bind(this));
	this.timer.on('timer:play:update',this.refresh.bind(this));

	this.time_window = time_window;
	this.time_window.on('tw:update',this.draw.bind(this));

	// update slider style
	this.slider_offset = 0;

	this.init_DOM();
	// update slider's position
	this.draw();

};

Samotraces.UI.Widgets.TimeSlider.prototype = {
	init_DOM: function() {
		// create the slider
		this.slider_element = document.createElement('div');
		this.element.appendChild(this.slider_element);

		// hand made drag&drop
		var widget = this;
		this.add_behaviour('changeTimeOnDrag',this.slider_element,{
				onUpCallback: function(delta_x) {
					var new_time = widget.timer.time + delta_x*widget.time_window.get_width()/widget.element.clientWidth;
					widget.timer.set(new_time);
				},
				onMoveCallback: function(offset) {
					var offset = widget.slider_offset + offset;
					widget.slider_element.setAttribute('style','left: '+offset+'px;');
				},
			});
	},

	draw: function() {
		this.slider_offset = (this.timer.time - this.time_window.start)*this.element.clientWidth/this.time_window.get_width();
		this.slider_element.setAttribute('style','left:'+this.slider_offset+'px; display: block;');
	},

};


