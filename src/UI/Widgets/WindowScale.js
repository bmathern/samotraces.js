/**
 * @summary Widget for visualising a time scale.
 * @class Widget for visualising a time scale.
 * @author Benoît Mathern
 * @requires d3.js framework (see <a href="http://d3js.org">d3js.org</a>)
 * @constructor
 * @mixes Samotraces.UI.Widgets.Widget
 * @description
 * Samotraces.UI.Widgets.WindowScale is a generic
 * Widget to visualise the temporal scale of a 
 * {@link Samotraces.TimeWindow|TimeWindow}. This
 * widget uses d3.js to calculate and display the scale.
 *
 * Note: unless the optional argument is_javascript_date is defined,
 * the widget will try to guess if time is displayed as numbers,
 * or if time is displayed in year/month/day/hours/etc.
 * This second option assumes that the time is represented in
 * milliseconds since 1 January 1970 UTC.
 * @param {String}	divId
 *     Id of the DIV element where the widget will be
 *     instantiated
 * @param {} time_window
 *     TimeWindowCenteredOnTime object
 * @param {Boolean} [is_javascript_date]
 *     Boolean that describes if the scale represents a JavaScript Date object.
 *     If set to true, the widget will display years, months, days, hours, minutes...
 *     as if the time given was the number of milliseconds ellapsed since 1 January 1970 UTC.
 *     If set to false, the widget will display the numbers without attempting
 *     any conversion.
 *     This argument is optional. If not set, the widget will try to guess:
 *     If the number of the start of the given TimeWindow is above a billion, then
 *     it is assumed that the JavaScript Date object has been used to represent time.
 *     Otherwise, the numerical value of time will be displayed.
 */
Samotraces.UI.Widgets.WindowScale = function(html_id,time_window,is_javascript_date) {
	// WidgetBasicTimeForm is a Widget
	Samotraces.UI.Widgets.Widget.call(this,html_id);

	this.add_class('Widget-WindowScale');
	$(window).resize(this.draw.bind(this));

	this.window = time_window;
//	time_window.addObserver(this);
	this.window.on('tw:update',this.draw.bind(this));
	this.window.on('tw:translate',this.draw.bind(this));

	// trying to guess if time_window is related to a Date() object
	if(this.window.start > 1000000000) { // 1o^9 > 11 Jan 1970 if a Date object
		this.is_javascript_date = is_javascript_date || true;
	} else {
		this.is_javascript_date = is_javascript_date || false;
	}

	this.init_DOM();
	// update slider's position
	this.draw();

};

Samotraces.UI.Widgets.WindowScale.prototype = {
	init_DOM: function() {
		// create the slider
		this.svg = d3.select("#"+this.id).append("svg");
		if(this.is_javascript_date) {
			this.x = d3.time.scale(); //.range([0,this.element.getSize().x]);
		} else {
			this.x = d3.scale.linear();
		}
		this.xAxis = d3.svg.axis().scale(this.x); //.orient("bottom");
		this.x.domain([this.window.start,this.window.end]);
		this.svgAxis = this.svg
			.append("g");

/*		var widget = this;
		Samotraces.Lib.addBehaviour('changeTimeOnDrag',this.element,{
				onUpCallback: function(delta_x) {
					var time_delta = -delta_x*widget.time_window.get_width()/widget.element.clientWidth;
					widget.time_window.translate(time_delta);					
				},
				onMoveCallback: function(offset) {
				},
			});*/
		this.add_behaviour('zommOnScroll',this.element,{timeWindow: this.window});
	},

	draw: function() {
//console.log("redraw");
		this.x.range([0,this.element.clientWidth]);// = d3.time.scale().range([0,this.element.getSize().x]);
		this.x.domain([this.window.start,this.window.end]);
		this.svgAxis.call(this.xAxis);
	},
};


