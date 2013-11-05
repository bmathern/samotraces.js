
var Samotraces = Samotraces || {};
Samotraces.Lib = Samotraces.Lib || {};

Samotraces.Lib.Timer = function(time) {
	// Addint the Observable trait
	Samotraces.Lib.Observable.call(this); /** @todo kept for compatibility -> remove */
	Samotraces.Lib.EventBuilder.call(this);
	this.time = time || 0;
};

Samotraces.Lib.Timer.prototype = {
	set: function(time) {
		new_time = Number(time);
		if(this.time != new_time) {
			this.time = new_time;
			this.notify('updateTime',this.time); /** @todo kept for compatibility -> remove */
			this.trigger('updateTime',this.time);
		}
	}
};

