
var Samotraces = Samotraces || {};
Samotraces.Objects = Samotraces.Objects || {};

Samotraces.Objects.Timer = function(time) {
	// Addint the Observable trait
	Samotraces.Objects.Observable.call(this); /** @todo kept for compatibility -> remove */
	Samotraces.Objects.EventBuilder.call(this);
	this.time = time || 0;
};

Samotraces.Objects.Timer.prototype = {
	set: function(time) {
		new_time = Number(time);
		if(this.time != new_time) {
			this.time = new_time;
			this.notify('updateTime',this.time); /** @todo kept for compatibility -> remove */
			this.trigger('updateTime',this.time);
		}
	}
};

// Timer is Observable
//Samotraces.Objects.Observable.call(Samotraces.Objects.Timer.prototype);
