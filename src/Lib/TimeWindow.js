
var Samotraces = Samotraces || {};
Samotraces.Lib = Samotraces.Lib || {};

Samotraces.Lib.TimeWindow = function(opt) {
	// Addint the Observable trait
	Samotraces.Lib.Observable.call(this); /** @todo kept for compatibility -> remove */
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
		throw('Samotraces.Objects.TimeWindow error. Arguments could not be parsed.');
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
	set_start: function(time) {
		if(this.start != time) {
			/** @todo Handle correctly the bind to the timer (if this.timer) */
			this.start = time;
			this.__calculate_width();
			this.notify('updateTimeWindow'); /** @todo kept for compatibility -> remove */
			this.trigger('updateTimeWindow');
		}
	},
	set_end: function(time) {
		if(this.start != time) {
			/** @todo Handle correctly the bind to the timer (if this.timer) */
			this.end = time;
			this.__calculate_width();
			this.notify('updateTimeWindow'); /** @todo kept for compatibility -> remove */
			this.trigger('updateTimeWindow');
		}
	},
	get_width: function() {
		return this.width;
	},
	set_width: function(width,center) {
		/** @todo Handle correctly the bind to the timer (if this.timer) */
		if( center === undefined) {
			center = this.start + this.width/2;
		}
		this.start = center - width/2;
		this.end = center + width/2;
		this.width = width;
		this.notify('updateTimeWindow'); /** @todo kept for compatibility -> remove */
			this.trigger('updateTimeWindow');
	},
	translate: function(delta) {
		if(this.timer) {
			this.timer.set(this.timer.time + delta);
		} else {
			this.start = this.start + delta;
			this.end = this.end + delta;
			this.notify('updateTimeWindow'); /** @todo kept for compatibility -> remove */
			this.trigger('updateTimeWindow');
		}
	},
	zoom: function(coef) {
		/** @todo Handle correctly the bind to the timer (if this.timer) */
		this.set_width(this.width*coef);
	},
};

