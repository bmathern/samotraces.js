
var Samotraces = Samotraces || {};
Samotraces.Objects = Samotraces.Objects || {};

Samotraces.Objects.TimeWindowCenteredOnTime = function(timer,width) {
	// Addint the Observable trait
	Samotraces.Objects.Observable.call(this);
	timer.addObserver(this);
	this.timer = timer;
	this.width = width;
	this.start = this.timer.time-this.width/2;
	this.end = this.timer.time+this.width/2;
};

Samotraces.Objects.TimeWindowCenteredOnTime.prototype = {
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
	},
	update: function(message,object) {
		switch(message) {
			case 'updateTime':
				time = object;
				this.set_start(time - this.width/2);
				this.set_end(time + this.width/2);
			//	this.notify('updateWindowStartTime',this.start);
			//	this.notify('updateWindowEndTime',this.end);
				break;
			default:
				this.parent(message,object);
				break;
		}
	},
	set_width: function(width) {
		this.width = width;
		this.set_start(this.timer.time - this.width/2);
		this.set_end(this.timer.time + this.width/2);
	}
};

// TimeWindowCenteredOnTime is Observable
//Samotraces.Objects.Observable.call(Samotraces.Objects.TimeWindowCenteredOnTime.prototype);


