/**
 * Selector is a shortname for the 
 * {@link Samotraces.Selector}
 * object.
 * @typedef Selector
 * @see Samotraces.Selector
 */
/**
 * @summary Object that stores a selection of objects
 * @class Object that stores a selection of objects
 * @author Benoît Mathern
 * @constructor
 * @augments Samotraces.EventHandler
 * @fires Samotraces.Selector#selection:add
 * @fires Samotraces.Selector#selection:remove
 * @fires Samotraces.Selector#selection:empty
 * @description
 * The {@link Samotraces.Selector|Selector} object
 * is a Javascript object that stores a selection of Objects.
 * This Object stores Objects that are selected and informs 
 * widgets or other objects (via the 
 * triggered events) when the selection changes.
 * When first instanciated, the selection is empty.
 *
 * In order to select an object, the 
 * {@link Samotraces.Selector#select|Selector#select()} 
 * method has to be called.
 * Similarly, in order to unselect an object, the 
 * {@link Samotraces.Selector#unselect|Selector#unselect()} 
 * method has to be called.
 * The whole selection can be emptied at once with the 
 * {@link Samotraces.Selector#empty|Selector#empty()}
 * method.
 * 
 * @param {string} type - A string describing the type of
 *     object to be selected ('Obsel', 'Trace', 'TimeWindow', etc.). 
 * @param {string} [selection_mode='single'] 
 *     In 'single' mode, the selection contains one object maximum.
 *     This means that adding an object to a non-empty selection
 *     will replace the previously selected object with the new one.
 *     In 'multiple' mode, the selection can be extended and objects
 *     can be individually added or removed.
 * @param {EventConfig}	[events]
 *     Events to listen to and their corresponding callbacks.
 */
Samotraces.Selector = function(type,selection_mode,events) {
	// Adding the Observable trait
	Samotraces.EventHandler.call(this,events);
	this.mode = selection_mode || 'single'; // other option is 'multiple'
	this.type = type;
	this.selection = [];
	// TODO: ajouter eventListener sur Trace si type = obsel
	// -> Quand "trace:remove:obsel" -> vérifie si un obsel a
	// été supprimé de la sélection.
};

Samotraces.Selector.prototype = {
	/**
	 * Method to call to select an Object.
	 * @param {Object} object
	 *     Object to add to the selection
	 * @fires Samotraces.Selector#selection:add
	 */
	select: function(object) {
		if(this.mode === 'multiple') {
			this.selection.push(object);
		} else {
			this.selection = [object];
		}
		/**
		 * Object selected event.
		 * @event Samotraces.Selector#selection:add
		 * @type {object}
		 * @property {String} type - The type of the event (= "selection:add").
		 * @property {Object} data - The selected object.
		 */
		this.trigger('selection:add',object);
	},
	/**
	 * Method to empty the current selection.
	 * @fires Samotraces.Selector#selection:empty
	 */
	empty: function() {
		this.selection = [];
		/**
		 * Object unselected event.
		 * @event Samotraces.Selector#selection:empty
		 * @type {object}
		 * @property {String} type - The type of the event (= "selection:empty").
		 */
		this.trigger('selection:empty');
	},
	/**
	 * Method that checks if the selection is empty
	 * @returns {Boolean} Returns true if the selection and empty 
	 *     and false if the selection is not empty.
	 */
	is_empty: function() {
		return (this.selection.length === 0);
	},
	/**
	 * Gets the current selection
	 * @returns {Array} Array of selected objects
	 */
	get_selection: function() {
		return this.selection;
	},
	/**
	 * Method to call to remove an Object from the selection.
	 * @param {Object} object
	 *     Object to remove from the selection
	 * @fires Samotraces.Selector#selection:remove
	 */
	unselect: function(object) {
		if(this.mode === 'multiple') {
			var found = false;
			this.selection = this.selection.filter(function(el) {
				if(el === object) {
					found = true;	
					return false;
				} else {
					return true;
				}
			});
			if(!found) { return false; }
		} else {
			this.selection = [];
		}
		/**
		 * Object unselected event.
		 * @event Samotraces.Selector#selection:remove
		 * @type {object}
		 * @property {String} type - The type of the event (= "selection:remove").
		 */
		this.trigger('selection:remove',object);
		return true;
	},
	/**
	 * Method to call to toggle the selection of an Object.
	 * If the Object was previously unselected, it becomes selected.
	 * If the Object was previously selected, it becomes unselected.
	 * @param {Object} object
	 *     Object to toggle from the selection
	 */
	toggle: function(object) {
		if(this.mode === 'multiple') {
			if(!this.unselect(object)) {
				this.select(object);
			}
		} else {
			if(this.selection.length == 0 || this.selection[0] !== object) {
				this.select(object);
			} else {
				this.unselect(object);
			}
		}
	}
};

