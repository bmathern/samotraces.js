
// Check if relevant namespaces exist - or create them.
var Samotraces = Samotraces || {};
Samotraces.Widgets = Samotraces.Widgets || {};
Samotraces.Widgets.ktbs = Samotraces.Widgets.ktbs || {};

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
 * @param {Samotraces.Lib.Ktbs.Base} ktbs_base
 *     Ktbs Base to bind to.
 * @param {Samotraces.Widgets.EventConfig} [events]
 *     Events to listen to and their corresponding callbacks.
 */
Samotraces.Widgets.ktbs.ListTracesInBases = function(html_id,ktbs_base,events) {
	// WidgetBasicTimeForm is a Widget
	Samotraces.Widgets.Widget.call(this,html_id);
	Samotraces.Lib.EventHandler.call(this);
	this.add_class('Widget-ListTraces');

	this.parse_events(events);

	this.base = ktbs_base;
	this.base.addEventListener('base:update',this.refresh.bind(this));

	this.init_DOM();
};

Samotraces.Widgets.ktbs.ListTracesInBases.prototype = {
	init_DOM: function() {
		this.element.innerHTML = "";

		var title = document.createElement('h2');
		var title_text = document.createTextNode('Base: '+this.base.get_uri());
		title.appendChild(title_text);
		this.element.appendChild(title);

		this.datalist_element = document.createElement('ul');
		this.element.appendChild(this.datalist_element);

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
};



