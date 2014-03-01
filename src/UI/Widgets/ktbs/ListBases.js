
Samotraces.UI.Widgets.ktbs = Samotraces.UI.Widgets.ktbs || {};

/**
 * @class Generic Widget for visualising the available bases of a KTBS.
 * @author Benoît Mathern
 * @constructor
 * @augments Samotraces.Widgets.Widget
 * @description
 * TODO ecrire description
 * @todo ECRIRE LA DESCRIPTION
 * @param {String}	html_id
 *     Id of the DIV element where the widget will be
 *     instantiated
 * @param {Samotraces.Lib.KTBS} ktbs
 *     KTBS to bind to.
 * @param {Samotraces.Lib.EventHandler.EventConfig} [events]
 *     Events to listen to and their corresponding callbacks.
 */
Samotraces.UI.Widgets.ktbs.ListBases = function(html_id,ktbs,events) {
	// WidgetBasicTimeForm is a Widget
	Samotraces.UI.Widgets.Widget.call(this,html_id);
	Samotraces.EventHandler.call(this,events);
	this.add_class('Widget-ListBases');

	this.ktbs = ktbs;
	ktbs.on('ktbs:update',this.refresh.bind(this));

	this.init_DOM();
};

Samotraces.UI.Widgets.ktbs.ListBases.prototype = {
	init_DOM: function() {
		this.element.innerHTML = "";
		$(this.element).append('<h2>KTBS root: '+this.ktbs.get_uri()+'</h2>');
/*
		var title = document.createElement('h2');
		var title_text = document.createTextNode('KTBS root: '+this.ktbs.get_uri());
		title.appendChild(title_text);
		this.element.appendChild(title);
*/
		this.datalist_element = document.createElement('ul');
		this.element.appendChild(this.datalist_element);

		this.add_button = document.createElement('button');
		$(this.add_button).append('New base');
		this.element.appendChild(this.add_button);
		$(this.add_button).click(this.open_form.bind(this));
	},
	open_form: function() {

		this.add_button.disabled = true;

		this.form = {};

		this.form.input_id = document.createElement('input');
		this.form.input_id.size = 20;
		this.form.text1 = document.createTextNode(' Base ID: ');
		this.form.input_label = document.createElement('input');
		this.form.input_label.size = 20;
		this.form.text2 = document.createTextNode(' label: ');
		this.form.button = document.createElement('button');
		$(this.form.button).append('create');

		$(this.element).append(this.form.text1);
		$(this.element).append(this.form.input_id);
		$(this.element).append(this.form.text2);
		$(this.element).append(this.form.input_label);
		$(this.element).append(this.form.button);

		$(this.form.button).click(this.create_base.bind(this));

	},
	create_base: function(e) {
		if($(this.form.input_id).val() !== "") {
			console.log("Creating a new base...");
			this.ktbs.create_base($(this.form.input_id).val(),$(this.form.input_label).val());
		} else {
			console.log("Empty base name... No base created");
		}
		
		for( var k in this.form ) {
			$(this.form[k]).remove();
		}
		this.add_button.disabled = false;
	},
	refresh: function() {
		// clear
		this.datalist_element.innerHTML = '';
		var li_element;
		this.ktbs.list_bases().forEach(function(b) {
				li_element = document.createElement('li');
				li_element.appendChild(document.createTextNode(b));
				li_element.addEventListener('click',(function() {this.trigger('ui:click:base',b)}).bind(this));
				this.datalist_element.appendChild(li_element);
			},this);

	},
};



