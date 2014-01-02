/**
 * Trace is a shortname for the 
 * {@link Samotraces.Lib.Trace}
 * object.
 * @typedef Trace
 * @see Samotraces.Lib.Trace
 */
/**
 * @summary JavaScript (abstract) Trace class.
 * @class JavaScript (abstract) Trace class.
 * @author Benoît Mathern
 * @fires Samotraces.Lib.Trace#trace:create:obsel
 * @fires Samotraces.Lib.Trace#trace:update
 * @constructor
 * @abstract
 * @augments Samotraces.Lib.EventHandler
 * @description
 * Samotraces.Lib.DemoTrace is a Javascript Trace object.
 * Methods are available to get 
 * the Obsels from the trace, create new Obsels, etc.
 *
 * The trace is initialised empty. Obsels have to be created
 * by using the {@link Samotraces.Lib.DemoTrace#newObsel} method.
 */
Samotraces.Lib.Trace = function() {
	// Adding the Observable trait
	Samotraces.Lib.EventHandler.call(this);

	/* Array d'obsels */
	this.obsels = [];

};

Samotraces.Lib.Trace.prototype = {
	/**
	 * Creates a new obsel in the trace.
	 * @param {string} type Type of the new obsel
	 * @param {number} timeStamp Timestamp of the new obsel
	 * @param {Object} attributes Additional attributes of the
	 *     new obsel.
	 * @todo update documentation by creating (fake) Trace
	 * object from which each trace object must inherit.
	 * This way, all traces have the same documentation.
	 * @todo use KTBS abstract API.
	 */
	newObsel: function(type,timeStamp,attributes) {
		console.log('Method Trace:newObsel() is abstract...');
		/**
		 * New obsel event.
		 * @event Samotraces.Lib.Trace#trace:create:obsel
		 * @type {object}
		 * @property {string} type - The type of the event (= "trace:create:obsel").
		 * @property {Samotraces.Lib.Obsel} data - The new obsel.
		 */
		/**
		 * Trace change event.
		 * @event Samotraces.Lib.Trace#trace:update
		 * @type {object}
		 * @property {string} type - The type of the event (= "trace:update").
		 * @property {Array.<Samotraces.Lib.Obsel>} data - Updated array of obsels of the trace.
		 */
	},
	
	getObsel: function(id) {
		console.log('Method Trace:getObsel() is abstract...');
	},

/// OFFICIAL TRACE API

	/**
	 * Returns a list obsels of this trace matching the parameters
	 * @abstract
	 * @returns {Array.<Obsels>} List of obsels matching the parameters
	 * @param {number} [begin] 
	 * @param {number} [end] 
	 * @param {boolean} [reverse] 
	 */
	list_obsels: function(begin,end,reverse) {
		console.log('Error: Trace:list_obsels() is abstract...');
	}


};


