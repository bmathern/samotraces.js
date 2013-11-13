
// Check if relevant namespaces exist - or create them.
var Samotraces = Samotraces || {};
Samotraces.Lib = Samotraces.Lib || {};

/**
 * @class Object that stores the current time window
 * @author Benoît Mathern
 * @constructor
 * @augments Samotraces.Lib.EventBuilder
 * @description
 * Samotraces.Lib.TimeWindow is a Javascript Object that 
 * stores the current time window.
 * This Object stores a time window and informs widgets or other
 * objects when the time window changes.
 * A TimeWindow can be defined in two ways:
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
 * @todo Samotraces.Lib.Observable.call(this); kept for compatibility -> remove
 */
Samotraces.Lib.TimeWindow = function(opt) {
	// Addint the Observable trait
	Samotraces.Lib.Observable.call(this); 
	Samotraces.Lib.EventBuilder.call(this);
	if(opt.start !== undefined && opt.end  !== undefined) {
		this.start = opt.start;
		this.end = opt.end;
		this.__calculate_width();
	} else if (opt.timer !== undefined && opt.width  !== undefined) {
		this.set_width(opt.width,opt.timer.time)
		this.timer = opt.timer;
		this.timer.addEventListener('updateTime',this.updateTime.bind(this));
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
	 * @todo Handle correctly the bind to the timer (if this.timer) 
	 * @todo this.notify kept for compatibility -> remove
	 */
	set_start: function(time) {
		if(this.start != time) {
			this.start = time;
			this.__calculate_width();
			this.notify('updateTimeWindow');
			this.trigger('updateTimeWindow');
		}
	},
	/** 
	 * @todo Handle correctly the bind to the timer (if this.timer) 
	 * @todo this.notify kept for compatibility -> remove
	 */
	set_end: function(time) {
		if(this.start != time) {
			this.end = time;
			this.__calculate_width();
			this.notify('updateTimeWindow');
			this.trigger('updateTimeWindow');
		}
	},
	get_width: function() {
		return this.width;
	},
	/** 
	 * @todo Handle correctly the bind to the timer (if this.timer) 
	 * @todo this.notify kept for compatibility -> remove
	 */
	set_width: function(width,center) {
		if( center === undefined) {
			center = this.start + this.width/2;
		}
		this.start = center - width/2;
		this.end = center + width/2;
		this.width = width;
		this.notify('updateTimeWindow');
		this.trigger('updateTimeWindow');
	},
	/** @todo this.notify kept for compatibility -> remove */
	translate: function(delta) {
		if(this.timer) {
			this.timer.set(this.timer.time + delta);
		} else {
			this.start = this.start + delta;
			this.end = this.end + delta;
			this.notify('updateTimeWindow');
			this.trigger('updateTimeWindow');
		}
	},
	/** @todo Handle correctly the bind to the timer (if this.timer) */
	zoom: function(coef) {
		this.set_width(this.width*coef);
	},
};

