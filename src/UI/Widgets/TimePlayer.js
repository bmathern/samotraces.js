/**
 * @summary Widget for playing/pausing a timer and controlling videos.
 * @class Widget for playing/pausing a timer and controlling videos.
 * @author Benoît Mathern
 * @constructor
 * @mixes Samotraces.UI.Widgets.Widget
 * @description
 * Samotraces.UI.Widgets.TimePlayer is a Widget
 * that allow to trigger the "play/pause" mechanism
 * of a timer. In addition, it controls a set of videos
 * that are synchronised to this timer.
 * 
 * This widget observes a Samotraces.Timer object.
 * When the timer changes the videos are .
 * This widget also allow to change the time of the timer.
 * 
 * @param {String}	html_id
 *     Id of the DIV element where the widget will be
 *     instantiated
 * @param {Samotraces.Timer} timer
 *     Timer object to observe.
 * @param {Array.<Samotraces.UI.Widgets.TimePlayer.VideoConfig>} [videos]
 *     Array of VideoConfig, that defines the set of
 *     videos that will be synchronised on the timer.
 */
Samotraces.UI.Widgets.TimePlayer = function(html_id,timer,videos) {
	// WidgetBasicTimeForm is a Widget
	Samotraces.UI.Widgets.Widget.call(this,html_id);

	/**
	 * @typedef Samotraces.Widgets.TimePlayer.VideoConfig
	 * @property {string} id - Id of the HTML element
	 *     containing the video
	 * @property {string} [youtube] - Url of the youtube
	 *     video to display
	 * @property {string} [vimeo] - Url of the vimeo
	 *     video to display
	 */
	var video_ids = videos || [];

	this.videos = video_ids.map(function(v) {
		if(v.youtube) {
			return Popcorn.youtube('#'+v.id,v.youtube);
		} else if(v.vimeo) {
			return Popcorn.vimeo('#'+v.id,v.vimeo);
		} else {
			return Popcorn('#'+v.id);
		}
	});

	this.timer = timer;
	this.timer.on('timer:update',this.onUpdateTime.bind(this));
	this.timer.on('timer:play',this.onPlay.bind(this));
	this.timer.on('timer:pause',this.onPause.bind(this));


	this.init_DOM();
	this.onUpdateTime({data: this.timer.time});
};

Samotraces.UI.Widgets.TimePlayer.prototype = {
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

