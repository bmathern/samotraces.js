
var Samotraces = Samotraces || {};
Samotraces.Objects = Samotraces.Objects || {};

Samotraces.Objects.TimeWindow = function(start,end) {
	// Addint the Observable trait
	Samotraces.Objects.Observable.call(this);
	this.start = start;
	this.end = end;
};

Samotraces.Objects.TimeWindow.prototype = {
	set_start: function(time) {
		if(this.start != time) {
			this.start = time;
			this.notify('updateWindowStartTime',time);
		}
	},
	set_end: function(time) {
		if(this.start != time) {
			this.end = time;
			this.notify('updateWindowEndTime',time);
		}
	},
	get_width: function() {
		return this.end - this.start;
	}
};

// TimeWindow is Observable
//Samotraces.Objects.Observable.call(Samotraces.Objects.TimeWindow.prototype);
