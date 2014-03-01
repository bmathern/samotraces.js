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
 * @param {Samotraces.Lib.KTBS.Base} ktbs_base
 *     KTBS Base to bind to.
 * @param {Samotraces.Lib.EventHandler.EventConfig} [events]
 *     Events to listen to and their corresponding callbacks.
 */
Samotraces.UI.Widgets.ktbs.ListTracesInBases = function(html_id,ktbs_base,events) {
	// WidgetBasicTimeForm is a Widget
	Samotraces.UI.Widgets.Widget.call(this,html_id);
	Samotraces.EventHandler.call(this,events);
	this.add_class('Widget-ListTraces');

	this.base = ktbs_base;
	this.base.on('base:update',this.refresh.bind(this));

	this.init_DOM();
};

Samotraces.UI.Widgets.ktbs.ListTracesInBases.prototype = {
	init_DOM: function() {
		this.element.innerHTML = "";

		var title = document.createElement('h2');
		var title_text = document.createTextNode('Base: '+this.base.get_uri());
		title.appendChild(title_text);
		this.element.appendChild(title);

		this.datalist_element = document.createElement('ul');
		this.element.appendChild(this.datalist_element);

		this.remove_button = document.createElement('button');
		$(this.remove_button).append('Delete base');
		this.element.appendChild(this.remove_button);
		$(this.remove_button).click(this.remove_base.bind(this));

		this.add_button = document.createElement('button');
		$(this.add_button).append('New trace');
		this.element.appendChild(this.add_button);
		$(this.add_button).click(this.open_form.bind(this));

	},
	open_form: function() {

		this.add_button.disabled = true;

		this.form = {};

		this.form.input_id = document.createElement('input');
		this.form.input_id.size = 20;
		this.form.text1 = document.createTextNode(' Trace ID: ');
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

		$(this.form.button).click(this.create_trace.bind(this));

	},
	create_trace: function(e) {
		if($(this.form.input_id).val() !== "") {
			console.log("Creating a new trace...");
			this.base.create_stored_trace($(this.form.input_id).val(),null,null,null,$(this.form.input_label).val());
		} else {
			console.log("Empty trace name... No trace created");
		}
		
		for( var k in this.form ) {
			$(this.form[k]).remove();
		}
		this.add_button.disabled = false;
	},
	remove_base: function() {
		this.base.remove();
	},
	refresh: function() {
		// clear
		this.datalist_element.innerHTML = '';
		var li_element;
		this.base.list_traces().forEach(function(t) {
				li_element = document.createElement('li');
				li_element.appendChild(document.createTextNode(t['@id']));
				li_element.addEventListener('click',(function() {this.trigger('ui:click:trace',t['@id'])}).bind(this));
				this.datalist_element.appendChild(li_element);
			},this);

	},
	select: function() {
	}
};



