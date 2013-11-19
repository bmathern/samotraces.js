
var Samotraces = Samotraces || {};
Samotraces.Lib = Samotraces.Lib || {};

/**
 * @class Object that stores the current time
 * @author Benoît Mathern
 * @constructor
 * @augments Samotraces.Lib.EventBuilder
 * @description
 * Samotraces.Lib.Timer is a Javascript object that stores
 * the current time.
 * This Object stores a time and informs widgets or other
 * objects when the time changes.
 *
 * @param {Number} time Initial time of the timer (optional, default: 0).
 */

Samotraces.Lib.Timer = function(time) {
	// Addint the Observable trait
	Samotraces.Lib.EventHandler.call(this);
	this.time = time || 0;
};

Samotraces.Lib.Timer.prototype = {
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
	}
};

