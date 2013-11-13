
// Check if relevant namespaces exist - or create them.
var Samotraces = Samotraces || {};
Samotraces.Lib = Samotraces.Lib || {};

/**
 * @class Object that stores the currently selected obsel
 * @author Benoît Mathern
 * @constructor
 * @augments Samotraces.Lib.EventBuilder
 * @description
 * Samotraces.Lib.ObselSelector is a Javascript object that
 * stores the currently selected obsel.
 * This Object stores an obsel that is selected and informs 
 * widgets or other objects when the selected object changes
 * or if the obsel has been unselected.
 */
Samotraces.Lib.ObselSelector = function() {
	// Addint the Observable trait
	Samotraces.Lib.Observable.call(this);
	this.obsel = undefined;
};

Samotraces.Lib.ObselSelector.prototype = {
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

