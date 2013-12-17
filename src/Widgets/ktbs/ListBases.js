
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
 * @param {Samotraces.Lib.Ktbs} ktbs
 *     Ktbs to bind to.
 * @param {Samotraces.Widgets.EventConfig} [events]
 *     Events to listen to and their corresponding callbacks.
 */
Samotraces.Widgets.ktbs.ListBases = function(html_id,ktbs,events) {
	// WidgetBasicTimeForm is a Widget
	Samotraces.Widgets.Widget.call(this,html_id);
	Samotraces.Lib.EventHandler.call(this);
	this.add_class('Widget-ListBases');
	
	this.parse_events(events);

	this.ktbs = ktbs;
	ktbs.addEventListener('ktbs:update',this.refresh.bind(this));

	this.init_DOM();
};

Samotraces.Widgets.ktbs.ListBases.prototype = {
	init_DOM: function() {
		this.element.innerHTML = "";

		var title = document.createElement('h2');
		var title_text = document.createTextNode('Ktbs root: '+this.ktbs.get_uri());
		title.appendChild(title_text);
		this.element.appendChild(title);

		this.datalist_element = document.createElement('ul');
		this.element.appendChild(this.datalist_element);

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



