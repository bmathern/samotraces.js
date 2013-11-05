
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
	Samotraces.Objects.WindowState.addObserver(this);

	this.time_window = time_window;
	time_window.addObserver(this);

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
		this.x.domain([this.time_window.start,this.time_window.end]);
		this.svgAxis = this.svg
			.append("g");
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
//console.log("redraw");
		this.x.range([0,this.element.clientWidth]);// = d3.time.scale().range([0,this.element.getSize().x]);
		this.x.domain([this.time_window.start,this.time_window.end]);
		this.svgAxis.call(this.xAxis);
	},
};


