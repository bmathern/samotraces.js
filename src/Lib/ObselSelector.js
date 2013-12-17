
// Check if relevant namespaces exist - or create them.
var Samotraces = Samotraces || {};
Samotraces.Lib = Samotraces.Lib || {};

/**
 * @summary Object that stores the currently selected obsel
 * @class Object that stores the currently selected obsel
 * @author Benoît Mathern
 * @constructor
 * @augments Samotraces.Lib.EventHandler
 * @description
 * The {@link Samotraces.Lib.ObselSelector|ObselSelector} object
 * is a Javascript object that stores the currently selected obsel.
 * This Object stores an obsel that is selected and informs 
 * widgets or other objects (via the 
 * {@link Samotraces.Lib.ObselSelector#event:obselSelected|obselSelected}
 * and the 
 * {@link Samotraces.Lib.ObselSelector#event:obselUnselected|obselUnselected}
 * events) when the selected object changes
 * or if the obsel has been unselected. When first instanciated,
 * no obsel is selected.
 *
 * In order to select an obsel, the 
 * {@link Samotraces.Lib.ObselSelector#select|ObselSelector#select()} 
 * method has to be called.
 * Similarly, in order to unselect an obsel, the 
 * {@link Samotraces.Lib.ObselSelector#unselect|ObselSelector#unselect()} 
 * method has to be called.
 * 
 * Note: selecting a new obsel is equivalent to unselecting 
 * the current obsel and selecting the new obsel, except
 * that the widget listening to the 
 * {@link Samotraces.Lib.ObselSelector} events will only 
 * receive a
 * {@link Samotraces.Lib.ObselSelector#event:obselSelected|obselSelected}, 
 * and no 
 * {@link Samotraces.Lib.ObselSelector#event:obselUnselected|obselUnselected}
 * event.
 */
Samotraces.Lib.ObselSelector = function() {
	// Adding the Observable trait
	Samotraces.Lib.EventHandler.call(this);
	this.obsel = undefined;
};

Samotraces.Lib.ObselSelector.prototype = {
	/**
     * Method to call to select an obsel.
     * This method is typically called from widgets that can
     * visualise a trace. For instance, clicking on an obsel
     * displayed with the 
     * {@link Samotraces.Widgets.TraceDisplayIcons|TraceDisplayIcons}
     * widget, will call this method to select the obsel that
     * had been the target of the click.
     * @param {Samotraces.Lib.Obsel} obsel
     *     {@link Samotraces.Lib.Obsel|Obsel} object that is 
	 *     selected.
	 * @fires Samotraces.Lib.ObselSelector#obselSelected
     */
	select: function(obsel) {
		this.obsel = obsel;
		/**
		 * Obsel selected event.
		 * @event Samotraces.Lib.ObselSelector#obselSelected
		 * @type {object}
		 * @property {String} type - The type of the event (= "obselSelected").
		 * @property {Samotraces.Lib.Obsel} data - The selected obsel.
		 */
		this.trigger('obselSelected',obsel);
	},
	/**
     * Method to call to unselect an obsel.
     * This method is typically called from widgets that can
     * visualise an obsel.
	 * @fires Samotraces.Lib.ObselSelector#obselUnselected
     */
	unselect: function() {
		this.obsel = undefined;
		/**
		 * Obsel unselected event.
		 * @event Samotraces.Lib.ObselSelector#obselUnselected
		 * @type {object}
		 * @property {String} type - The type of the event (= "obselUnselected").
		 */
		this.trigger('obselUnselected');
	}
};

