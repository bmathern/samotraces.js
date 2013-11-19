
// Check if relevant namespaces exist - or create them.
var Samotraces = Samotraces || {};
Samotraces.Widgets = Samotraces.Widgets || {};

/**
 * @class Generic Widget for visualising the current time.
 * @author Benoît Mathern
 * @constructor
 * @mixes Samotraces.Widgets.Widget
 * @see Samotraces.Widgets.Basic.ReadableTimeForm
 * @description
 * Samotraces.Widgets.Basic.TimeForm is a generic
 * Widget to visualise the current time.
 *
 * The time is displayed as a number. See
 * {@link Samotraces.Widgets.Basic.TimeForm} to convert
 * raw time (in ms from the 01/01/1970) to a human readable
 * format.
 * 
 * This widget observes a Samotraces.Objects.Timer object.
 * When the timer changes the new time is displayed.
 * This widget also allow to change the time of the timer.
 * 
 * @param {String}	html_id
 *     Id of the DIV element where the widget will be
 *     instantiated
 * @param {Samotraces.Objects.Timer} timer
 *     Timer object to observe.
 */
Samotraces.Widgets.TimeForm = function(html_id,timer) {
	// WidgetBasicTimeForm is a Widget
	Samotraces.Widgets.Widget.call(this,html_id);

	this.timer = timer;
	timer.addObserver(this);

	this.init_DOM();
	this.refresh(this.timer.time);
};

Samotraces.Widgets.TimeForm.prototype = {
	init_DOM: function() {

		var p_element = document.createElement('p');

		var text_node = document.createTextNode('Current time: ');
		p_element.appendChild(text_node);

		this.input_element = document.createElement('input');
		this.input_element.setAttribute('type','text');
		this.input_element.setAttribute('name','time');
		this.input_element.setAttribute('size',15);
		this.input_element.setAttribute('value',this.timer.time);
		p_element.appendChild(this.input_element);

		var submit_element = document.createElement('input');
		submit_element.setAttribute('type','submit');
		submit_element.setAttribute('value','Update time');
		p_element.appendChild(submit_element);

		this.form_element = document.createElement('form');
		this.form_element.addEventListener('submit', this.build_callback('submit'));

		this.form_element.appendChild(p_element);

		this.element.appendChild(this.form_element);
	},

	update: function(message,object) {
		switch(message) {
			case 'updateTime':
				time = object;
				this.refresh(time);	
				break;
			default:
				break;
		}
	},

	refresh: function(time) {
		this.input_element.value = time;
	},

	build_callback: function(event) {
		var timer = this.timer;
		var input_element = this.input_element;
		switch(event) {
			case 'submit':
				return function(e) {
					//console.log('WidgetBasicTimeForm.submit');
					e.preventDefault();
					timer.set(input_element.value);
					return false;
				};
			default:
				return function() {};
		}
	}

};

