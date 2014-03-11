/**
 * @summary Widget for visualising a trace.
 * @class Widget for visualising a trace.
 * @author Benoît Mathern
 * @requires d3.js framework (see <a href="http://d3js.org">d3js.org</a>)
 * @constructor
 * @mixes Samotraces.UI.Widgets.Widget
 * @description
 * DESCRIPTION TO COME....
 * @param {String}	divId
 *     Id of the DIV element where the widget will be
 *     instantiated
 * @param {Samotraces.Trace}	trace
 *     Trace object to display
 * @param {Samotraces.TimeWindow} time_window
 *     TimeWindow object that defines the time frame
 *     being currently displayed.
 * @todo add description and update doc...
 */
Samotraces.UI.Widgets.TraceDisplayObselOccurrences = function(divId,trace,time_window) {
	// WidgetBasicTimeForm is a Widget
	Samotraces.UI.Widgets.Widget.call(this,divId);

	this.add_class('Widget-ObselOccurrences');
	//this.add_class('Widget-TraceDisplayObselOccurrences');
	$(window).resize(this.refresh_x.bind(this));

	this.trace = trace;
	this.trace.on('trace:update',this.draw.bind(this));
	this.trace.on('trace:create_obsel',this.draw.bind(this));
	this.trace.on('trace:remove_obsel',this.draw.bind(this));
	this.trace.on('trace:edit_obsel',this.obsel_redraw.bind(this));

	this.window = time_window;
	this.window.on('tw:update',this.refresh_x.bind(this));
	this.window.on('tw:translate',this.translate_x.bind(this));

//	this.obsel_selector = obsel_selector;
//	this.window.addEventListener('',this..bind(this));

	this.init_DOM();
	this.data = this.trace.list_obsels();

	// create function that returns value or function
	var this_widget = this;

	this.draw();
};

Samotraces.UI.Widgets.TraceDisplayObselOccurrences.prototype = {
	init_DOM: function() {


		var div_elmt = d3.select('#'+this.id);
		this.svg = div_elmt.append('svg')
				.attr("xmlns","http://www.w3.org/2000/svg")
				.attr("version","1.1");


		this.scale_x = this.element.clientWidth/this.window.get_width();
		this.translate_offset = 0;

		this.svg_gp = this.svg.append('g')
						.attr('transform', 'translate(0,0)');

		// event listeners
		var widget = this;
		this.add_behaviour('changeTimeOnDrag',this.element,{
				onUpCallback: function(delta_x) {
					var time_delta = -delta_x*widget.window.get_width()/widget.element.clientWidth;
					widget.svg_gp.attr('transform','translate('+(-widget.translate_offset)+',0)');
					widget.window.translate(time_delta);
				},
				onMoveCallback: function(offset) {
					widget.svg_gp.attr('transform','translate('+(offset-widget.translate_offset)+',0)');
				},
			});
		this.add_behaviour('zommOnScroll',this.element,{timeWindow: this.window});
	},


	// TODO: needs to be named following a convention 
	// to be decided on
	/**
	 * Calculates the X position in pixels corresponding to 
	 * the time given in parameter.
	 * @param {Number} time Time for which to seek the corresponding x parameter
	 */
	calculate_x: function(o) {
		return x = (o.get_begin() - this.window.start)*this.scale_x + this.translate_offset;
	},
	calculate_width: function(o) {
		return x = Math.max(0.01, (o.get_end() - o.get_begin())*this.scale_x ); // width of 0 => not displayed
	},
	translate_x: function(e) {
		var time_delta = e.data;
		this.translate_offset += time_delta*this.scale_x;
		this.svg_gp
			.attr('transform', 'translate('+(-this.translate_offset)+',0)');
	},

	refresh_x: function() {
		this.scale_x = this.element.clientWidth/this.window.get_width();
		this.translate_offset = 0;
		this.svg_gp
			.attr('transform', 'translate(0,0)');
		this.d3Obsels()
			.attr('x',this.calculate_x.bind(this))
			.attr('width',this.calculate_width.bind(this))
	},

	draw: function(e) {
		if(e) {
			switch(e.type) {
				case "trace:update":
					this.data = this.trace.list_obsels();
					break;
				default:
					this.data = this.trace.obsel_list; // do not want to trigger the refreshing of list_obsels()...
					break;
				}
		}

		this.d3Obsels()
			.exit()
			.remove();
		this.d3Obsels()
			.enter()
			.append('rect')
			//.attr('class','Samotraces-obsel')
			.attr('x',this.calculate_x.bind(this))
			.attr('y','0')
			.attr('width',this.calculate_width.bind(this))
			.attr('height','20');
			//.attr('stroke-width','1px')
			//.attr('stroke','black');
		// Storing obsel data with jQuery for accessibility from 
		// events defined by users with jQuery
		$('rect',this.element).each(function(i,el) {
			$.data(el,{
				'Samotraces-type': 'obsel',
				'Samotraces-data': d3.select(el).datum()
			});
		});
	},

	obsel_redraw: function(e) {
		obs = e.data;
		var sel = this.d3Obsels()
			.filter(function(o) {
//				console.log('data:id,obsel_edit_id',id,obs.get_id(),id == obs.get_id());
				return o.get_id() == obs.get_id();
			})
			.datum(obs)
			.attr('x',this.calculate_x.bind(this))
			.attr('width',this.calculate_width.bind(this))
			.attr('xlink:href',this.options.url);
	},

	d3Obsels: function() {
		return this.svg_gp
					.selectAll('circle,image,rect')
					// TODO: ATTENTION! WARNING! obsels MUST have a field id -> used as a key.
					//.data(this.data); //,function(d) { return d.id;});
					.data(this.data, function(d) { return d.id;}); // TODO: bogue in case no ID exists -> might happen with KTBS traces and new obsels
	},


};







