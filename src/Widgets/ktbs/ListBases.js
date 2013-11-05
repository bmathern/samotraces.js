
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
 * @param {Samotraces.Objects.Ktbs} ktbs
 *     Ktbs to bind to.
 */
Samotraces.Widgets.ktbs.ListBases = function(html_id,ktbs) {
	// WidgetBasicTimeForm is a Widget
	Samotraces.Widgets.Widget.call(this,html_id);
	this.add_class('WidgetListBases');

	this.ktbs = ktbs;
	ktbs.addObserver(this);

	this.init_DOM();
};

Samotraces.Widgets.ktbs.ListBases.prototype = {
	init_DOM: function() {

		var title = document.createElement('h2');
		var title_text = document.createTextNode(this.ktbs.url);
		title.appendChild(title_text);
		this.element.appendChild(title);

		this.datalist_element = document.createElement('ul');
		this.element.appendChild(this.datalist_element);

	},
	update: function(message,object) {
		switch(message) {
			case 'BasesListChanged':
				this.refresh(object);
				break;
			default:
				break;
		}
	},
	refresh: function(bases) {
		// clear
		this.datalist_element.innerHTML = '';
		var li_element;
		bases.forEach(function(el) {
				li_element = document.createElement('li');
				li_element.appendChild(document.createTextNode(el));
				this.datalist_element.appendChild(li_element);
			},this);

	},
};



