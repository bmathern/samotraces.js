
// Check if relevant namespaces exist - or create them.
var Samotraces = Samotraces || {};
Samotraces.Objects = Samotraces.Objects || {};

Samotraces.Objects.ObselSelector = function(time) {
	// Addint the Observable trait
	Samotraces.Objects.Observable.call(this);
	this.obsel = undefined;
};

Samotraces.Objects.ObselSelector.prototype = {
	select: function(obsel) {
		this.obsel = obsel;
		this.notify('obselSelected',obsel);
	},
	unselect: function() {
		this.obsel = undefined;
		/**
		 * Obsel unselected event.
		 * @event Samotraces.Objects.CurrentObsel#obselUnselected
		 * @type {object}
		 * @property {String} type - Type of the event.
		 */
		this.notify('obselUnselected');
	}
};

