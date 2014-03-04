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
Samotraces.UI.Widgets.TraceDisplayZoomContext = function(divId,trace,time_window1,time_window2,options1,options2) {
	// WidgetBasicTimeForm is a Widget
	Samotraces.UI.Widgets.Widget.call(this,divId);

	this.mode = 'window_sync';
	if(options1 !== undefined || options2 !== undefined) {
		this.mode = 'obsel_sync';
		if(options1 !== undefined && options1.hasOwnProperty('x')) {
			this.x1 = options1.x.bind(this);	
		}
		if(options2 !== undefined && options2.hasOwnProperty('x')) {
			this.x2 = options2.x.bind(this);
		}
	}

	this.add_class('Widget-ObselOccurrences');
	//this.add_class('Widget-TraceDisplayObselOccurrences');
	$(window).resize(this.refresh_x.bind(this));

	this.trace = trace;
	this.trace.on('trace:update',this.draw.bind(this));
	this.trace.on('trace:create_obsel',this.draw.bind(this));
	this.trace.on('trace:remove_obsel',this.draw.bind(this));
	this.trace.on('trace:edit_obsel',this.obsel_redraw.bind(this));

	this.window1 = time_window1;
	this.window1.on('tw:update',this.refresh_x.bind(this));
	this.window1.on('tw:translate',this.refresh_x.bind(this));

	this.window2 = time_window2;
	this.window2.on('tw:update',this.refresh_x.bind(this));
	this.window2.on('tw:translate',this.refresh_x.bind(this));

//	this.obsel_selector = obsel_selector;
//	this.window1.addEventListener('',this..bind(this));

	this.init_DOM();
	this.data = this.trace.list_obsels();

	// create function that returns value or function
	var this_widget = this;

	this.draw();
};

Samotraces.UI.Widgets.TraceDisplayZoomContext.prototype = {
	init_DOM: function() {


		var div_elmt = d3.select('#'+this.id);
		this.svg = div_elmt.append('svg')
				.attr("xmlns","http://www.w3.org/2000/svg")
				.attr("version","1.1");


		this.scale_x1 = this.element.clientWidth/this.window1.get_width();
		this.scale_x2 = this.element.clientWidth/this.window2.get_width();
		this.translate_offset = 0;

		this.sync_path = this.svg.append('path')
					.attr('style','stroke:grey;stroke-width:1px;fill:#ddd;');
		this.svg_gp = this.svg.append('g')
						.attr('transform', 'translate(0,0)');

	},


	// TODO: needs to be named following a convention 
	// to be decided on
	/**
	 * Calculates the X position in pixels corresponding to 
	 * the time given in parameter.
	 * @param {Number} time Time for which to seek the corresponding x parameter
	 */
	calculate_x: function(t) {
		return x = (t - this.w_start)*this.scale_x;
	},
	o2x1: function(o) {
		this.w_start = this.window1.start;
		this.scale_x = this.scale_x1;
		return this.x1(o);
	},
	o2x2: function(o) {
		this.w_start = this.window2.start;
		this.scale_x = this.scale_x2;
		return this.x2(o);
	},
	x1: function(o) {
		return this.calculate_x(o.get_begin());
	},
	x2: function(o) {
		return this.calculate_x(o.get_begin());
	},
	calculate_path: function(o) {
		var p = [];
		var x1 = this.o2x1(o);
		var x2 = this.o2x2(o);
		p = ['M',x1,'0','C',x1,'10,',x2,'10,',x2,'20'];
		return p.join(' ');
	},
	calculate_visibility: function(o) {
		var x1 = this.o2x1(o);
		if(x1 < 0) return false;
		if(x1 > this.element.clientWidth) return false;
		var x2 = this.o2x2(o);
		if(x2 > this.element.clientWidth) return false;
		if(x2 < 0) return false;
		return true;
	},
	calculate_style: function(o) {
		if(this.calculate_visibility(o)) {
		//if(true) {
			return 'stroke:grey;stroke-width:1px;fill:none;';
		} else {
			return 'stroke:none;stroke-width:1px;fill:none;';
		}
	},
	translate_x: function(e) {
		var time_delta = e.data;
		this.translate_offset += time_delta*this.scale_x;
		this.svg_gp
			.attr('transform', 'translate('+(-this.translate_offset)+',0)');
	},

	refresh_x: function() {
		this.scale_x1 = this.element.clientWidth/this.window1.get_width();
		this.scale_x2 = this.element.clientWidth/this.window2.get_width();
		this.translate_offset = 0;
		this.svg_gp
			.attr('transform', 'translate(0,0)');
		if(this.mode == "obsel_sync") {
			this.d3Obsels()
				.attr('d',this.calculate_path.bind(this))
				.attr('style',this.calculate_style.bind(this));
		} else {
			this.sync_path.attr('d',this.calculate_sync_path.bind(this));
		}
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
		if(this.mode == "obsel_sync") {
			this.d3Obsels()
				.exit()
				.remove();
			this.d3Obsels()
				.enter()
				.append('path')
				//.attr('class','Samotraces-obsel')
				.attr('d',this.calculate_path.bind(this))
				.attr('style',this.calculate_style.bind(this));
			this.d3Obsels()
				//.attr('stroke-width','1px')
				//.attr('stroke','black');
			// Storing obsel data with jQuery for accessibility from 
			// events defined by users with jQuery
			$('path',this.element).each(function(i,el) {
				$.data(el,{
					'Samotraces-type': 'obsel',
					'Samotraces-data': d3.select(el).datum()
				});
			});
		} else {
			this.sync_path.attr('d',this.calculate_sync_path.bind(this));
		}
	},
	calculate_sync_path: function() {
		var ts = Math.max(this.window1.start,this.window2.start);
		var te = Math.min(this.window1.end,this.window2.end);
		var x1s = (Math.min(ts,this.window1.end) - this.window1.start)*this.scale_x1;
		var x2s = (Math.min(ts,this.window2.end) - this.window2.start)*this.scale_x2;
		var x1e = (Math.max(te,this.window1.start) - this.window1.start)*this.scale_x1;
		var x2e = (Math.max(te,this.window2.start) - this.window2.start)*this.scale_x2;
		var p = ["M",x1s,"0","C",x1s,"20,",x2s,"0,",x2s,"20","L",x2e,"20","C",x2e,"0,",x1e,"20,",x1e,"0","Z"];
		return p.join(" ");
	},
	obsel_redraw: function(e) {
		obs = e.data;
		var sel = this.d3Obsels()
			.filter(function(o) {
//				console.log('data:id,obsel_edit_id',id,obs.get_id(),id == obs.get_id());
				return o.get_id() == obs.get_id();
			})
			.datum(obs)
			.attr('d',this.calculate_path.bind(this))
	},

	d3Obsels: function() {
		return this.svg_gp
					.selectAll('path')
					// TODO: ATTENTION! WARNING! obsels MUST have a field id -> used as a key.
					//.data(this.data); //,function(d) { return d.id;});
					.data(this.data, function(d) { return d.id;}); // TODO: bogue in case no ID exists -> might happen with KTBS traces and new obsels
	},


};







