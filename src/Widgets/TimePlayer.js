
// Check if relevant namespaces exist - or create them.
var Samotraces = Samotraces || {};
Samotraces.Widgets = Samotraces.Widgets || {};

/**
 * @summary Widget for visualising the current time as a number.
 * @class Widget for visualising the current time as a number.
 * @author Benoît Mathern
 * @constructor
 * @mixes Samotraces.Widgets.Widget
 * @see Samotraces.Widgets.ReadableTimeForm
 * @description
 * Samotraces.Widgets.TimeForm is a generic
 * Widget to visualise the current time.
 *
 * The time is displayed as a number. See
 * {@link Samotraces.Widgets.TimeForm} to convert
 * raw time (in ms from the 01/01/1970) to a human readable
 * format.
 * 
 * This widget observes a Samotraces.Lib.Timer object.
 * When the timer changes the new time is displayed.
 * This widget also allow to change the time of the timer.
 * 
 * @param {String}	html_id
 *     Id of the DIV element where the widget will be
 *     instantiated
 * @param {Samotraces.Lib.Timer} timer
 *     Timer object to observe.
 */
Samotraces.Widgets.TimePlayer = function(html_id,timer,videos) {
	// WidgetBasicTimeForm is a Widget
	Samotraces.Widgets.Widget.call(this,html_id);


	var video_ids = videos || [];

	this.videos = video_ids.map(function(v) {
		if(v.youtube) {
			return Popcorn.youtube('#'+v.id,v.youtube);
		} else if(v.vimeo) {
			return Popcorn.vimeo('#'+v.id,v.youtube);
		} else {
			return Popcorn('#'+v.id);
		}
	});

	this.timer = timer;
	this.timer.addEventListener('updateTime',this.onUpdateTime.bind(this));
	this.timer.addEventListener('play',this.onPlay.bind(this));
	this.timer.addEventListener('pause',this.onPause.bind(this));


	this.init_DOM();
	this.onUpdateTime({data: this.timer.time});
};

Samotraces.Widgets.TimePlayer.prototype = {
	init_DOM: function() {

		var p_element = document.createElement('p');

		this.play_button = document.createElement('img');
		this.play_button.setAttribute('src','images/control_play.png');

		p_element.appendChild(this.play_button);

		this.play_button.addEventListener('click',this.onClickPlayButton.bind(this));

		this.element.appendChild(p_element);
	},

	onUpdateTime: function(e) {
		this.videos.map(function(v) {
			v.currentTime(e.data);
		});
	},

	onClickPlayButton: function(e) {
		if(this.timer.is_playing) {
			this.timer.pause();
			this.play_button.setAttribute('src','images/control_play.png');
		} else {
			this.timer.play();
			this.play_button.setAttribute('src','images/control_pause.png');
		}
	},

	onPlay: function(e) {
		this.videos.map(function(v) {
			v.play(e.data);
		});
	},

	onPause: function(e) {
		this.videos.map(function(v) {
			v.pause(e.data);
		});
	},
};

