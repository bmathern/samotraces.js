
var Samotraces = Samotraces || {};
Samotraces.Lib = Samotraces.Lib || {};

Samotraces.Lib.SelfUpdatingTimer = function(init_time,period,update_function) {
	// Addint the Observable trait
	Samotraces.Lib.EventHandler.call(this);
	this.time = init_time || 0;
	this.period = period || 2000;
	this.update_function = update_function || function() {return Date.now();};
	this.is_playing = false;
};

Samotraces.Lib.SelfUpdatingTimer.prototype = {
	/**
	 * Sets the Timer to the given time.
	 * @fires Samotraces.Lib.Timer#updateTime
	 * @param {Number} time New time
	 */
	set: function(time) {
		new_time = Number(time);
		if(this.time != new_time) {
			this.time = new_time; 
			/**
			 * Time change event.
			 * @event Samotraces.Lib.Timer#updateTime
			 * @type {object}
			 * @property {String} type - The type of the event (= "updateTime").
			 */
			this.trigger('updateTime',this.time);
		}
	},
	/**
	 * Sets or get the Timer's current time.
	 * If no parameter is given, the current time is returned.
	 * Otherwise, sets the Timer to the givent time.
	 * @fires Samotraces.Lib.Timer#updateTime
	 * @param {Number} time New time (optional)
	 */
	time: function(time) {
		if(time) {
			new_time = Number(time);
			if(this.time != new_time) {
				this.time = new_time; 
				/**
				 * Time change event.
				 * @event Samotraces.Lib.Timer#updateTime
				 * @type {object}
				 * @property {String} type - The type of the event (= "updateTime").
				 */
				this.trigger('updateTime',this.time);
			}
		} else {
			return this.time;
		}
	},

	play: function() {
		var update = function() {
			this.time = this.update_function(this.time);
			this.trigger('updateTimePlay',this.time);
		};
		this.interval_id = window.setInterval(update.bind(this),this.period);
		this.is_playing = true;
		this.trigger('play',this.time);
	},
	pause: function() {
		window.clearInterval(this.interval_id);
		this.is_playing = false;
		this.trigger('pause',this.time);
	}
};

// Timer is Observable
//Samotraces.Objects.Observable.call(Samotraces.Objects.SelfUpdatingTimer.prototype);
