
// Check if relevant namespaces exist - or create them.
var Samotraces = Samotraces || {};
Samotraces.Lib = Samotraces.Lib || {};

/**
 * @class Javascript Trace Object.
 * @author Benoît Mathern
 * @constructor
 * @abstract
 * @augments Samotraces.Lib.Observable
 * @description
 * Samotraces.Lib.DemoTrace is a Javascript Trace object.
 * Methods are available to get 
 * the Obsels from the trace, create new Obsels, etc.
 *
 * The trace is initialised empty. Obsels have to be created
 * by using the {@link Samotraces.Lib.DemoTrace#newObsel} method.
 */
Samotraces.Lib.Trace = function() {
	// Addint the Observable trait
	Samotraces.Lib.Observable.call(this);
	var current_trace = this;

	/* Nombre d'obsels dans la trace */
	this.count = 0; // sert d'ID pour le prochain observé.
	/* Array d'obsels */
	this.traceSet = [];

};

Samotraces.Lib.Trace.prototype = {
	/**
	 * Creates a new obsel in the trace.
	 * @param {String} type Type of the new obsel
	 * @param {Number} timeStamp Timestamp of the new obsel
	 * @param {Object} attributes Additional attributes of the
	 *     new obsel.
	 * @todo update documentation by creating (fake) Trace
	 * object from which each trace object must inherit.
	 * This way, all traces have the same documentation.
	 * @todo use KTBS abstract API.
	 */
	newObsel: function(type,timeStamp,attributes) {
		console.log('Method Trace:newObsel() is abstract...');
	},
	
	getObsel: function(id) {
		console.log('Method Trace:getObsel() is abstract...');
	},

};


