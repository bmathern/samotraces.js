
// Check if relevant namespaces exist - or create them.
var Samotraces = Samotraces || {};
Samotraces.Lib = Samotraces.Lib || {};

/**
 * @summary Object that stores the current time window
 * @class Object that stores the current time window
 * @author Benoît Mathern
 * @constructor
 * @augments Samotraces.Lib.EventHandler
 * @description
 * The {@link Samotraces.Lib.TimeWindow} object is a Javascript Object
 * that stores the current time window.
 * This Object stores a time window and informs widgets or other
 * objects when the time window changes via the 
 * {@link Samotraces.Lib.TimeWindow#event:tw:update|tw:update}
 * event.
 * A {@link Samotraces.Lib.TimeWindow|TimeWindow} can be defined in two ways:
 *
 * 1.  by defining a lower and upper bound
 * 2.  by defining a timer and a width.
 *
 * @param {Object} opt	Option parameter that defines the time
 *     window. Variables opt.start and opt.end must 
 *     be defined if using lower and upper bound definition.
 *     Variables opt.timer and opt.width must 
 *     be defined if using timer and width definition.
 * @param {Number} opt.start Starting time of the time window (lower bound).
 * @param {Number} opt.end Ending time of the time window (upper bound).
 * @param {Samotraces.Lib.Timer} opt.timer Timer object, which time
 *     is used to define the middle of the current time window.
 * @param {Number} opt.width Width of the time window.
 *
 */
Samotraces.Lib.TimeWindow = function(opt) {
	// Adding the Observable trait
	Samotraces.Lib.EventHandler.call(this);
	if(opt.start !== undefined && opt.end  !== undefined) {
		this.start = opt.start;
		this.end = opt.end;
		this.__calculate_width();
	} else if (opt.timer !== undefined && opt.width  !== undefined) {
		this.set_width(opt.width,opt.timer.time)
		this.timer = opt.timer;
		this.timer.addEventListener('timer:update',this.updateTime.bind(this));
		this.timer.addEventListener('timer:play:update',this.updateTime.bind(this));
	} else {
		throw('Samotraces.Lib.TimeWindow error. Arguments could not be parsed.');
	}
};

Samotraces.Lib.TimeWindow.prototype = {
	__calculate_width: function() {
		this.width = this.end - this.start;
	},
	updateTime: function(e) {
		var time = e.data;
		this.set_width(this.width,time);
	},
	/** 
	 * @fires Samotraces.Lib.TimeWindow#tw:update
	 * @todo Handle correctly the bind to the timer (if this.timer) 
	 */
	set_start: function(time) {
		if(this.start != time) {
			this.start = time;
			this.__calculate_width();
			/**
			 * Time window change event.
			 * @event Samotraces.Lib.TimeWindow#tw:update
			 * @type {object}
			 * @property {String} type - The type of the event (= "tw:update").
			 */
			this.trigger('tw:update');
		}
	},
	/**
	 * @fires Samotraces.Lib.TimeWindow#tw:update
	 * @todo Handle correctly the bind to the timer (if this.timer) 
	 */
	set_end: function(time) {
		if(this.start != time) {
			this.end = time;
			this.__calculate_width();
			this.trigger('tw:update');
		}
	},
	get_width: function() {
		return this.width;
	},
	/**
	 * @fires Samotraces.Lib.TimeWindow#tw:update
	 * @todo Handle correctly the bind to the timer (if this.timer) 
	 */
	set_width: function(width,center) {
		if( center === undefined) {
			center = this.start + this.width/2;
		}
		this.start = center - width/2;
		this.end = center + width/2;
		this.width = width;
		this.trigger('tw:update');
	},
	/**
	 * @fires Samotraces.Lib.TimeWindow#tw:update
	 */
	translate: function(delta) {
		if(this.timer) {
			this.timer.set(this.timer.time + delta);
		} else {
			this.start = this.start + delta;
			this.end = this.end + delta;
			this.trigger('tw:update');
		}
	},
	/** @todo Handle correctly the bind to the timer (if this.timer) */
	zoom: function(coef) {
		this.set_width(this.width*coef);
	},
};

