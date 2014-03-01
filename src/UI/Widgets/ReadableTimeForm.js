/**
 * @summary Widget for visualising the current time as a date/time.
 * @class Widget for visualising the current time as a date/tim.
 * @author Benoît Mathern
 * @constructor
 * @mixes Samotraces.Widgets.Widget
 * @see Samotraces.UI.Widgets.TimeForm
 * @description
 * Samotraces.UI.Widgets.ReadableTimeForm is a generic
 * Widget to visualise the current time.
 *
 * The time (in ms from the 01/01/1970) is converted in a
 * human readable format (as opposed to
 * {@link Samotraces.Widgets.TimeForm} widget
 * which display raw time).
 * 
 * This widget observes a Samotraces.Lib.Timer object.
 * When the timer changes the new time is displayed.
 * This widget also allow to change the time of the timer.
 * 
 * @param {String}	html_id
 *     Id of the DIV element where the widget will be
 *     instantiated
 * @param {Samotraces.Timer} timer
 *     Timer object to observe.
 */
Samotraces.UI.Widgets.ReadableTimeForm = function(html_id,timer) {
	// WidgetBasicTimeForm is a Widget
	Samotraces.UI.Widgets.Widget.call(this,html_id);

	this.add_class('Widget-ReadableTimeForm');

	this.timer = timer;
	this.timer.on('timer:update',this.refresh.bind(this));
	this.timer.on('timer:play:update',this.refresh.bind(this));

	this.init_DOM();
	this.refresh({data: this.timer.time});
};

Samotraces.UI.Widgets.ReadableTimeForm.prototype = {
	init_DOM: function() {

		var p_element = document.createElement('p');

		var text_node = document.createTextNode('Current time: ');
		p_element.appendChild(text_node);


		this.year_element = document.createElement('input');
		this.year_element.setAttribute('type','text');
		this.year_element.setAttribute('name','year');
		this.year_element.setAttribute('size',4);
		this.year_element.setAttribute('value','');
		p_element.appendChild(this.year_element);
		p_element.appendChild(document.createTextNode('/'));

		this.month_element = document.createElement('input');
		this.month_element.setAttribute('type','text');
		this.month_element.setAttribute('name','month');
		this.month_element.setAttribute('size',2);
		this.month_element.setAttribute('value','');
		p_element.appendChild(this.month_element);
		p_element.appendChild(document.createTextNode('/'));

		this.day_element = document.createElement('input');
		this.day_element.setAttribute('type','text');
		this.day_element.setAttribute('name','day');
		this.day_element.setAttribute('size',2);
		this.day_element.setAttribute('value','');
		p_element.appendChild(this.day_element);
		p_element.appendChild(document.createTextNode(' - '));

		this.hour_element = document.createElement('input');
		this.hour_element.setAttribute('type','text');
		this.hour_element.setAttribute('name','hour');
		this.hour_element.setAttribute('size',2);
		this.hour_element.setAttribute('value','');
		p_element.appendChild(this.hour_element);
		p_element.appendChild(document.createTextNode(':'));

		this.minute_element = document.createElement('input');
		this.minute_element.setAttribute('type','text');
		this.minute_element.setAttribute('name','minute');
		this.minute_element.setAttribute('size',2);
		this.minute_element.setAttribute('value','');
		p_element.appendChild(this.minute_element);
		p_element.appendChild(document.createTextNode(':'));

		this.second_element = document.createElement('input');
		this.second_element.setAttribute('type','text');
		this.second_element.setAttribute('name','second');
		this.second_element.setAttribute('size',8);
		this.second_element.setAttribute('value','');
		p_element.appendChild(this.second_element);
/*
		this.input_element = document.createElement('input');
		this.input_element.setAttribute('type','text');
		this.input_element.setAttribute('name','');
		this.input_element.setAttribute('size',15);
		this.input_element.setAttribute('value',this.timer.time);
		p_element.appendChild(this.input_element);
*/
		var submit_element = document.createElement('input');
		submit_element.setAttribute('type','submit');
		submit_element.setAttribute('value','Update time');
		p_element.appendChild(submit_element);

		this.form_element = document.createElement('form');
		this.form_element.addEventListener('submit', this.build_callback('submit'));

		this.form_element.appendChild(p_element);

		this.element.appendChild(this.form_element);
	},

	refresh: function(e) {
		time = e.data
		var date = new Date();
		date.setTime(time);
		this.year_element.value   = date.getFullYear();
		this.month_element.value  = date.getMonth()+1;
		this.day_element.value    = date.getDate();
		this.hour_element.value   = date.getHours();
		this.minute_element.value = date.getMinutes();
		this.second_element.value = date.getSeconds()+date.getMilliseconds()/1000;
	},

	build_callback: function(event) {
		var timer = this.timer;
		var time_form = this;
		switch(event) {
			case 'submit':
				return function(e) {
					//console.log('WidgetBasicTimeForm.submit');
					e.preventDefault();


		var date = new Date();
		date.setFullYear(time_form.year_element.value);
		date.setMonth(time_form.month_element.value-1);
		date.setDate(time_form.day_element.value);
		date.setHours(time_form.hour_element.value);
		date.setMinutes(time_form.minute_element.value);
		date.setSeconds(time_form.second_element.value);

					timer.set(date.getTime());
					return false;
				};
			default:
				return function() {};
		}
	}

};


