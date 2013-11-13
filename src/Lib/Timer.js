
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
	Samotraces.Lib.Observable.call(this); /** @todo kept for compatibility -> remove */
	Samotraces.Lib.EventBuilder.call(this);
	this.time = time || 0;
};
/** @todo this.notify kept for compatibility -> remove */
Samotraces.Lib.Timer.prototype = {
	set: function(time) {
		new_time = Number(time);
		if(this.time != new_time) {
			this.time = new_time;
			this.notify('updateTime',this.time); 
			this.trigger('updateTime',this.time);
		}
	}
};

