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
	 * @todo use KTBS abstract API.
	 */
	newObsel: function(type,timeStamp,attributes) {
		var id = this.count;
		this.count++;
		this.traceSet.push(new Samotraces.Lib.Obsel(id,timeStamp,type,attributes));
		this.trigger('trace:update',this.traceSet);
	},

	updateObsel: function(old_obs,new_obs) {
		console.log('Method KtbsTrace:updateObsel() not implemented yet...');
//		this.traceSet.erase(old_obs);
//		new_obs.id = old_obs.id; // check that id stay consistent
//		this.traceSet.push(new_obs);
//		this.notify('updateObsel',{old_obs: old_obs, new_obs: new_obs});
//		return new_obs;
	},
	
	removeObsel: function(obs) {
		console.log('Method KtbsTrace:removeObsel() not implemented yet...');
//		this.traceSet.erase(old_obs);
//		this.notify('removeObsel',obs);
	},
	
	getObsel: function(id) {
		console.log('Method KtbsTrace:getObsel() not implemented yet...');
	},

};


