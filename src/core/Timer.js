/**
 * @summary Object that stores the current time
 * @class Object that stores the current time
 * @author Benoît Mathern
 * @constructor
 * @augments Samotraces.EventHandler
 * @fires Samotraces.Timer#timer:update
 * @description
 * Samotraces.Timer is a Javascript object that stores
 * the current time.
 * This Object stores a time and informs widgets or other
 * objects when the time changes.
 *
 * @param {Number} [init_time=0] 
 *     Initial time of the timer (optional, default: 0).
 * @param {Number} [period=2000] 
 *     Perdiod (in ms) at which the timer will update itself in
 *     "play" mode.
 * @param {function} [update_function]
 *     Function called to update the timer when in "play" mode
 *     (function that returns the value of 
 *     <code>Date.now()</code> by default).
 */

Samotraces.Timer = function Timer(init_time,period,update_function) {
	// Adding the Observable trait
	Samotraces.EventHandler.call(this);
	this.time = init_time || 0;
	this.period = period || 2000;
	this.update_function = update_function || function() {return Date.now();};
	this.is_playing = false;
};

Samotraces.Timer.prototype = {
	/**
	 * Sets the Timer to the given time.
	 * @fires Samotraces.Timer#timer:update
	 * @param {Number} time New time
	 */
	set_time: function(time) {
		new_time = Number(time);
		if(this.time != new_time) {
			this.time = new_time; 
			/**
			 * Time change event.
			 * @event Samotraces.Timer#timer:update
			 * @type {object}
			 * @property {String} type - The type of the event (= "timer:update").
			 */
			this.trigger('timer:update',this.time);
		}
	},
	/**
	 * Sets the Timer to the given time.
	 * @deprecated Use {@link Samotraces.Timer.set_time|set_time} instead.
	 * @fires Samotraces.Timer#timer:update
	 * @param {Number} time New time
	 */
	set: function(t) { return this.set_time(t); },
	/**
	 * Gets the current time of the Timer
	 * @returns {Number} Current time of the Timer.
	 */
	get_time: function(time) {
		return this.time;
	},
	/**
	 * Sets or get the Timer's current time.
	 * If no parameter is given, the current time is returned.
	 * Otherwise, sets the Timer to the givent time.
	 * @fires Samotraces.Timer#timer:update
	 * @param {Number} [time] New time
	 */
	time: function(time) {
		if(time) {
			new_time = Number(time);
			if(this.time != new_time) {
				this.time = new_time; 
				this.trigger('timer:update',this.time);
			}
		} else {
			return this.time;
		}
	},

	/**
	 * Starts the play mode: the timer will be updated
	 * according to the update_function every period
	 * as specified at the initialisation of the Timer.
	 * @todo SPECIFY WAYS TO CHANGE PERIOD AND UPDATE_FUNCTIOn
	 */
	play: function() {
		var update = function() {
			this.time = this.update_function(this.time);
			/**
			 * Time change event (actualising time when playing)
			 * @event Samotraces.Timer#timer:play:update
			 * @type {object}
			 * @property {String} type 
			 *     - The type of the event (= "timer:play:update").
			 */
			this.trigger('timer:play:update',this.time);
		};
		this.interval_id = window.setInterval(this.update_function.bind(this),this.period);
		this.is_playing = true;
		this.trigger('timer:play',this.time);
	},
	/**
	 * Stops the play mode.
	 */
	pause: function() {
		window.clearInterval(this.interval_id);
		this.is_playing = false;
		this.trigger('timer:pause',this.time);
	}
};

