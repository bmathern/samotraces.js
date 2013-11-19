
// Check if relevant namespaces exist - or create them.
var Samotraces = Samotraces || {};
Samotraces.Widgets = Samotraces.Widgets || {};

/**
 * @class Generic Widget for visualising an Obsel.
 * @author Benoît Mathern
 * @constructor
 * @mixes Samotraces.Widgets.Widget
 * @description
 * Samotraces.Widgets.ObselInspector is a generic
 * Widget to visualise Obsels.
 * 
 * This widget observes a {@link Samotraces.Lib.ObselSelector|ObselSelector}
 * object. When an obsel is selected, the information about
 * this obsel is displayed in the widget. When an obsel is
 * unselected, the widget closes. Clicking on the red cross
 * will close the widget (and automatically unselect the obsel).
 * When no obsel are selected, the widget is not visible,
 * selecting an obsel will make it appear.
 *
 * @param {String}	html_id
 *     Id of the DIV element where the widget will be
 *     instantiated
 * @param {Samotraces.Lib.ObselSelector} obsel_selector
 *     ObselSelector object to observe.
 */
Samotraces.Widgets.ObselInspector = function(html_id,obsel_selector) {
	// WidgetBasicTimeForm is a Widget
	Samotraces.Widgets.Widget.call(this,html_id);
	this.add_class('WidgetObselInspector');

	this.obsel = obsel_selector;
	obsel_selector.addObserver(this);

	this.init_DOM();
};

Samotraces.Widgets.ObselInspector.prototype = {
	init_DOM: function() {

		this.close_element = document.createElement('span');
		var img_element = document.createElement('img');
		img_element.setAttribute('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAFPSURBVDiNlZOxTgJREEXPfUuPEmyMrQSLJaHWhCiltYX/oZ2VscLKr6CgpgOMRn/ARRAtiTYYsVd2LFjIstklcZqXzMy5M5mZpxEUf+HC4ARoO7jeM3sjxV6kUjjPPRQ0c9DQMzQMzmN5nyEc+WZBHA4k30EPKC58ghv1YQzsJIqtiKTBkX04wW1Kt0UHvb5U6UuVDBigrSGUQngw2EpGDb6jVjeSMcFEsC8zI5B8D7ppImkmmMyg7psFDsA3C2ZQF0z+AwPIzJbBaFh3wGYGPw2hFt+Qi0c98JTwJao7D7y4b5k8kKo2n0M+S8Agb9AdSNUVgQjuAIUsOGYFg85CRE9QdvCYAU+jN20mXwYHzoOzNFgwCaEWQi1jOwXBhfrwDmwn4fiq1tzJ2Ala62BYeydNjaD4M/+Npwb3Obgsm72mtMxQ2g3nuceCVg6u/gBs54alonwdWQAAAABJRU5ErkJggg==');
		this.close_element.appendChild(img_element);
		this.element.appendChild(this.close_element);

		this.datalist_element = document.createElement('ul');
		this.element.appendChild(this.datalist_element);

		this.element.style.display = 'none';

		this.close_element.addEventListener('click',this.onCloseAction.bind(this));
	},
	update: function(message,object) {
		switch(message) {
			case 'obselSelected':
				obs = object;
				this.inspect(obs);
				break;
			case 'obselUnselected':
				this.close();
				break;
			default:
				break;
		}
	},
	inspect: function(obs) {
		// clear
		this.datalist_element.innerHTML = '';

		var attributes = obs.attributes;
		
		var li_element = document.createElement('li');
		li_element.appendChild(document.createTextNode('Id: '+ obs.id));
		this.datalist_element.appendChild(li_element);

		li_element = document.createElement('li');
		li_element.appendChild(document.createTextNode('TimeStamp: '+ obs.timestamp));
		this.datalist_element.appendChild(li_element);

		li_element = document.createElement('li');
		li_element.appendChild(document.createTextNode('Type: '+ obs.type));
		this.datalist_element.appendChild(li_element);

		for(var key in obs.attributes) {
			li_element = document.createElement('li');
			li_element.appendChild(document.createTextNode(key  +': '+ obs.attributes[key]));
			this.datalist_element.appendChild(li_element);
		}

		this.element.style.display = 'block';
	},
	close: function() {
		this.element.style.display = 'none';
	},
	onCloseAction: function() {
		this.obsel.unselect();
	}
};



