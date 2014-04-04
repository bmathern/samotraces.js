// This file is only for the documentation. No actual implmentation.
// TODO make a Javascript class that throws an error if called?
// TODO pas de doc abstraite tans Trace.js -> doc concrète dans LocalTrace -> c'est moins compliqué !!! -> de toute façon, Javascript ne fait pas de vrai héritage !

/**
 * Trace is a shortname for the 
 * {@link Samotraces.Trace}
 * object.
 * @typedef Trace
 * @see Samotraces.Trace
 */

/* *
 * @summary JavaScript (abstract) Trace class.
 * @class JavaScript (abstract) Trace class.
 * @constructor Samotraces.Trace-ktbs-API
 * @abstract
 * @todo define Trace-ktbs-API abstract class
 */
/* *
 * @summary JavaScript (abstract) Trace class.
 * @class JavaScript (abstract) Trace class.
 * @constructor Samotraces.Trace-Samotraces-API
 * @augments Trace-ktbs-API
 * @abstract
 * @todo define Trace-Samotraces-API abstract class
 */


/**
 * @summary JavaScript (abstract) Trace class.
 * @class JavaScript (abstract) Trace class.
 * @author Benoît Mathern
 * @fires Samotraces.Trace#trace:create:obsel
 * @fires Samotraces.Trace#trace:remove:obsel
 * @fires Samotraces.Trace#trace:edit:obsel
 * @fires Samotraces.Trace#trace:update
 * @constructor Samotraces.Trace
 * @abstract
 * @augments Samotraces.EventHandler
 * @description
 * This page documents the abstract Trace API.
 * @todo DOCUMENT THIS FILE!!!!
 */

/**
 * @summary
 * Triggers when a new obsel has been added to the trace
 * @event Samotraces.Trace#trace:create:obsel
 * @type {object}
 * @property {string} type - The type of the event (= "trace:create:obsel").
 * @property {Samotraces.Obsel} data - The new obsel.
 */
/**
 * @summary
 * Triggers when the trace has changed.
 * @event Samotraces.Trace#trace:update
 * @type {object}
 * @property {string} type - The type of the event (= "trace:update").
 * @property {Array.<Samotraces.Obsel>} data - Updated array of obsels of the trace.
 */
/**
 * @summary
 * Triggers when an Obsel has been removed from the trace.
 * @event Samotraces.Trace#trace:remove:obsel
 * @type {object}
 * @property {string} type - The type of the event (= "trace:remove:obsel").
 * @property {Samotraces.Obsel} data - Obsel that has been removed from the trace.
 */
/**
 * @summary
 * Triggers when an Obsel has been edited.
 * @event Samotraces.Trace#trace:edit:obsel
 * @type {object}
 * @property {string} type - The type of the event (= "trace:edit:obsel").
 * @property {Samotraces.Obsel} data - Obsel that has been edited.
 */



//	get_label: function() { return this.label; },
//	set_label: function(lbl) {},
//	reset_label: function() {},

//	get_model: function() { return this.model; },
//	get_origin: function() { return this.origin; },
//	list_source_traces: function() { return this.source_traces; },
//	list_transformed_traces: function() { return this.transformed_traces; },
/**
 * @summary
 * Returns a list obsels of this trace matching the parameters.
 * @description
 * Returns a list obsels of this trace matching the parameters.
 * @method Samotraces.Trace#list_obsels
 * @abstract
 * @returns {Array.<Obsels>} List of obsels matching the parameters
 * @param {number} [begin] Minimum of time for retrieved Obsels.
 * @param {number} [end] Maximum of time for retrieved Obsels.
 * @param {boolean} [reverse] 
 * @todo TODO finish documentation
 */
//	list_obsels: function(begin,end,reverse) {},

/**
 * @summary
 * Retrieve an obsel in the trace from its ID.
 * @param {String} id ID of the Obsel to retrieve
 * @returns {Obsel} Obsel that corresponds to this ID
 *     or undefined if the obsel was not found.
 */	
//	set_model: function(model) {	},
//	set_origin: function(origin) {	},
//	get_default_subject: function() { return this.subject;},
//	set_default_subject: function(subject) {	},
//	create_obsel: function(obsel_params) {	},
//	remove_obsel: function(obs) {	},

