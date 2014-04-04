/**
 * TimeWindow is a shortname for the 
 * {@link Samotraces.TimeWindow}
 * object.
 * @typedef TimeWindow
 * @see Samotraces.TimeWindow
 */
/**
 * @summary Object that stores the current time window
 * @class Object that stores the current time window
 * @author Benoît Mathern
 * @constructor
 * @augments Samotraces.EventHandler
 * @description
 * The {@link Samotraces.TimeWindow} object is a Javascript Object
 * that stores the current time window.
 * This Object stores a time window and informs widgets or other
 * objects when the time window changes via the 
 * {@link Samotraces.TimeWindow#tw:update|tw:update}
 * event.
 * A {@link Samotraces.TimeWindow|TimeWindow} can be defined in two ways:
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
 * @param {Samotraces.Timer} opt.timer Timer object, which time
 *     is used to define the middle of the current time window.
 * @param {Number} opt.width Width of the time window.
 *
 */
Samotraces.TimeWindow = function TimeWindow(opt) {
	// Adding the Observable trait
	Samotraces.EventHandler.call(this);
	if(opt.start !== undefined && opt.end  !== undefined) {
		this.start = opt.start;
		this.end = opt.end;
		this.__calculate_width();
	} else if (opt.timer !== undefined && opt.width  !== undefined) {
		this.set_width(opt.width,opt.timer.time)
		this.timer = opt.timer;
		this.timer.on('timer:update',this._private_updateTime.bind(this));
		this.timer.on('timer:play:update',this._private_updateTime.bind(this));
	} else {
		throw('Samotraces.TimeWindow error. Arguments could not be parsed.');
	}
};

Samotraces.TimeWindow.prototype = {
	__calculate_width: function() {
		this.width = this.end - this.start;
	},
	_private_updateTime: function(e) {
		var time = e.data;
		var delta = time - (this.start + this.width/2);

		this.start = time - this.width/2
		this.end = time + this.width/2
		this.trigger('tw:translate',delta);

//		this.set_width(this.width,time);
	},
	/** 
	 * Sets the start time of the time window.
	 * @param {Number} time Starting time of the time window.
	 * @fires Samotraces.TimeWindow#tw:update
	 */
	set_start: function(time) {
		if(this.start != time) {
			this.start = time;
			this.__calculate_width();
			/**
			 * Time window change event.
			 * @event Samotraces.TimeWindow#tw:update
			 * @type {object}
			 * @property {String} type - The type of the event (= "tw:update").
			 */
			this.trigger('tw:update');
		}
	},
	/**
	 * Sets the end time of the time window.
	 * @param {Number} time Ending time of the time window.
	 * @fires Samotraces.TimeWindow#tw:update
	 */
	set_end: function(time) {
		if(this.end != time) {
			this.end = time;
			this.__calculate_width();
			this.trigger('tw:update');
		}
	},
	/**
	 * Gets the width of the time window (duration between start and end)
	 * @returns {Number} Width of the time window
	 */
	get_width: function() {
		return this.width;
	},
	/**
	 * Sets the width of the time of the time window.
	 * @param {Number} width New width of the time window.
	 * @param {Number} [center=(start+end)/2] New center of the time window.
	 * @fires Samotraces.TimeWindow#tw:update
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
	 * Translates the time window with a time delta.
	 * @param {Number} delta Time deltat that will be added to the time window.
	 * @fires Samotraces.TimeWindow#tw:translate
	 */
	translate: function(delta) {
		if(this.timer) {
			this.timer.set(this.timer.time + delta);
		} else {
			this.start = this.start + delta;
			this.end = this.end + delta;
			this.trigger('tw:translate',delta);
		}
	},
	/**
	 * Zooms the timewindow by multiplying the current width
	 * by the given coefficient. Zoom in if the coefficient
	 * is less than 1 and out if it is more than 1.
	 * @param {Number} coef Coefficient of the zoom to apply.
	 */
	zoom: function(coef) {
		this.set_width(this.width*coef);
	},
};

