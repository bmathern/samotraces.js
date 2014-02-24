/**
 * @summary Javascript Trace Object.
 * @class Javascript Trace Object.
 * @author Benoît Mathern
 * @constructor
 * @mixes Samotraces.Lib.EventHandler
 * @augments Samotraces.Lib.Trace
 * @description
 * Samotraces.Lib.DemoTrace is a Javascript Trace object.
 * Methods are available to get 
 * the Obsels from the trace, create new Obsels, etc.
 *
 * The trace is initialised empty. Obsels have to be created
 * by using the {@link Samotraces.Lib.DemoTrace#newObsel} method.
 */
Samotraces.Lib.DemoTrace = function() {
	// Addint the Observable trait
	Samotraces.Lib.EventHandler.call(this);
	var current_trace = this;

	/* Nombre d'obsels dans la trace */
	this.count = 0; // sert d'ID pour le prochain observé.
	/* Array d'obsels */
	this.traceSet = [];

};

Samotraces.Lib.DemoTrace.prototype = {
	/**
	 * Creates a new obsel in the trace.
	 * @param {String} type Type of the new obsel
	 * @param {Number} timeStamp Timestamp of the new obsel
	 * @param {Object} attributes Additional attributes of the
	 *     new obsel.
	 * @todo update documentation by creating (fake) Trace
	 * object from which each trace object must inherit.
	 * This way, all traces have the same documentation.
	 * @fires Samotraces.Lib.Trace#trace:update
	 * @fires Samotraces.Lib.Trace#trace:create:obsel
	 * @todo use KTBS abstract API.
	 */
	newObsel: function(type,timeStamp,attributes) {
		var id = this.count;
		this.count++;
		var obs = new Samotraces.Lib.Obsel({id: id,trace: this,begin: timeStamp,type: type,attributes: attributes})
		this.traceSet.push(obs);
		this.trigger('trace:update',this.traceSet);
		this.trigger('trace:create:obsel',obs);
	},

	/**
	 * Updates an obsel.
	 * @param {Obsel} old_obs Obsel to be updated
	 * @param {Obsel} new_obs Updated version of the obsel
	 * @fires Samotraces.Lib.Trace#trace:update:obsel
	 * @todo use KTBS abstract API.
	 */	
	updateObsel: function(old_obs,new_obs) {
		this.removeObsel(old_obs);
		this.traceSet.push(new_obs);
		//this.trigger()
		this.traceSet = this.traceSet.map(function(o) {
			if(o===old_obs) {
				return new_obs;
			} else {
				return o;
			}
		});
		this.trigger('trace:update:obsel',new_obs);
	},

	/**
	 * Remove an obsel from the trace.
	 * @param {Obsel} obs Obsel to remove from the trace
	 * @fires Samotraces.Lib.Trace#trace:remove:obsel
	 * @todo use KTBS abstract API.
	 */	
	removeObsel: function(obs) {
		this.traceSet = this.traceSet.filter(function(o) {
			return (o===obs)?false:true;
		});
		this.trigger('trace:remove:obsel',obs);
	},
	
	/**
	 * Retrieve an obsel in the trace from its ID.
	 * @param {String} id ID of the Obsel to retrieve
	 * @returns {Obsel} Obsel that corresponds to this ID
	 *     or undefined if the obsel was not found.
	 * @todo use KTBS abstract API.
	 */	
	getObsel: function(id) {
		return this.traceSet.find(function(o) { return (o.id == id); });
		console.log('Method KtbsTrace:getObsel() not implemented yet...');
	},

};


