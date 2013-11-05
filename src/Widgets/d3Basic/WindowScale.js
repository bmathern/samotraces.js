
// Check if relevant namespaces exist - or create them.
var Samotraces = Samotraces || {};
Samotraces.Widgets = Samotraces.Widgets || {};
Samotraces.Widgets.d3Basic = Samotraces.Widgets.d3Basic || {};

/**
 * @class Generic Widget for visualising a temporal scale.
 * @author Benoît Mathern
 * @requires d3.js framework (see <a href="http://d3js.org">d3js.org</a>)
 * @constructor
 * @augments Samotraces.Widgets.Widget
 * @description
 * Samotraces.Widgets.d3Basic.WindowScale is a generic
 * Widget to visualise the temporal scale of a trace. This
 * widget uses d3.js to calculate and display the scale.
 *
 * @param {String}	divId
 *     Id of the DIV element where the widget will be
 *     instantiated
 * @param time_window
 *     TimeWindowCenteredOnTime object
 */
Samotraces.Widgets.d3Basic.WindowScale = function(html_id,time_window) {
	// WidgetBasicTimeForm is a Widget
	Samotraces.Widgets.Widget.call(this,html_id);

	this.add_class('WidgetWindowScale');
	Samotraces.Lib.WindowState.addEventListener('resize',this.draw.bind(this));

	this.window = time_window;
//	time_window.addObserver(this);
	this.window.addEventListener('updateTimeWindow',this.draw.bind(this));

	this.init_DOM();
	// update slider's position
	this.draw();

};

Samotraces.Widgets.d3Basic.WindowScale.prototype = {
	init_DOM: function() {
		// create the slider
		this.svg = d3.select("#"+this.id).append("svg");
		this.x = d3.time.scale(); //.range([0,this.element.getSize().x]);
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
		Samotraces.Lib.addBehaviour('zommOnScroll',this.element,{timeWindow: this.window});
	},

	draw: function() {
//console.log("redraw");
		this.x.range([0,this.element.clientWidth]);// = d3.time.scale().range([0,this.element.getSize().x]);
		this.x.domain([this.window.start,this.window.end]);
		this.svgAxis.call(this.xAxis);
	},
};


