/**
 * @summary Javascript Trace Object.
 * @class Javascript Trace Object.
 * @author Benoît Mathern
 * @constructor
 * @mixes Samotraces.EventHandler
 * @augments Samotraces.Trace
 * @description
 * Samotraces.DemoTrace is a Javascript Trace object.
 * Methods are available to get 
 * the Obsels from the trace, create new Obsels, etc.
 *
 * The trace is initialised empty. Obsels have to be created
 * by using the {@link Samotraces.DemoTrace#newObsel} method.
 */
Samotraces.LocalTrace = function(source_traces) {
	// Addint the Observable trait
	Samotraces.EventHandler.call(this);

	/* Nombre d'obsels dans la trace */
	this.count = 0; // sert d'ID pour le prochain observé.
	/* Array d'obsels */
	this.obsel_list = [];
	this.source_traces = (source_traces!==undefined)?source_traces:[];
	this.source_traces.forEach(function(t) {
		t.transformed_traces.push(this);
	});
	this.transformed_traces = [];
	this.origin = "";
	//this.origin_offset = (new Date(0)).getMilliseconds();

};

Samotraces.LocalTrace.prototype = {
	/**
	 * @description
	 * Gets the label of the trace
	 * @returns {String} Label of the trace
	 */
	get_label: function() { return this.label; },
	/**
	 * @description
	 * Sets the label of the trace
	 * @param {String} lbl Label of the trace
	 */
	set_label: function(lbl) {
		this.label = lbl;
		this.trigger('trace:edit_meta');
	},
	/**
	 * @description
	 * Resets the label to the empty string
	 */
	reset_label: function() {
		this.label = "";
		this.trigger('trace:edit_meta');
	},

	/**
	 * @description
	 * Returns the model of the trace
	 * @returns Model of the trace
	 * @todo UPDATE WHAT IS A MODEL
	 */
	get_model: function() { return this.model; },
	/**
	 * @description
	 * Returns the origin of the trace
	 * @returns Origin of the trace
	 * @todo UPDATE WHAT IS AN ORIGIN 
	 */
	get_origin: function() { return this.origin; },
	//get_origin_offset: function() { return this.origin_offset; },
	/**
	 * @description
	 * Returns the source traces of this trace
	 * @returns {Array.<Trace>} Source traces of this trace.
	 */
	list_source_traces: function() { return this.source_traces; },
	/**
	 * @description
	 * Returns the traces transformed from this trace
	 * @returns {Array.<Trace>} Trace transformed from this trace
	 */
	list_transformed_traces: function() { return this.transformed_traces; },
	/**
	 * @description
	 * Returns the list of obsels in an optional time interval.
	 * If no minimum time and no maximum time constraint are
	 * defined, returns the whole list of obsels.
	 * If one of the two constraints are defined, then returns
	 * obsels matching the time constraints.
	 *
	 * Note: if an obsel overlaps with the start or the end
	 * constraint, then it will be included (for instance an 
	 * obsel that starts before the start constraint and ends
	 * after that constraint will be included).
	 * @param {Number} [begin] Minimum time constraint
	 * @param {Number} [end] Maximum time constraint
	 * @param {Boolean} [reverse=false] Returns the obsel list in
	 *     reverse chronological order if true and in normal
	 *     chronological order if false.
	 * @returns {Array.<Obsel>} List of relevant obsels
	 * @todo REVERSE IS NOT YET TAKEN INTO ACCOUNT 
	 */
	list_obsels: function(begin,end,reverse) {
		// TODO reverse is ignored.
		return this.obsel_list.filter(function(o) {
			if(end && o.get_begin() > end) { return false; }
			if(begin && o.get_end() < begin) { return false; }
			return true;
		});
	},

	/**
	 * Retrieve an obsel in the trace from its ID.
	 * @param {String} id ID of the Obsel to retrieve
	 * @returns {Obsel} Obsel that corresponds to this ID
	 *     or undefined if the obsel was not found.
	 * @todo use KTBS abstract API.
	 */	
	get_obsel: function(id) {
		var obs;
		this.obsel_list.forEach(function(o) {
			if(o.get_id() == id) { obs = o; }
		});
		return obs;
	},
	/**
	 * @description
	 * Sets the model of the trace
	 * @param model Model of the trace
	 * @todo UPDATE WHAT IS A MODEL
	 */
	set_model: function(model) {
		this.model = model;
		this.trigger('trace:edit_meta');
	},
	/**
	 * @description
	 * Sets the origin of the trace
	 * @param origin Origin of the trace
	 * @todo UPDATE WHAT IS AN ORIGIN
	 */
	set_origin: function(origin) {
		this.origin = origin;
	//	this.origin_offset = (new Date(origin)).getMilliseconds();
		this.trigger('trace:edit_meta');
	},
	/**
	 * @description
	 * Returns the default subject of the trace
	 * @returns {String} The trace default subject
	 */
	get_default_subject: function() { return this.subject;},
	/**
	 * @description
	 * Set the default subject of the trace
	 * @param {String} subject The trace default subject
	 */
	set_default_subject: function(subject) {
		this.subject = subject;
		this.trigger('trace:edit_meta');
	},

	/**
	 * @description
	 * Create a new obsel in the trace with the
	 * given properties
	 * @param {ObselParam} obsel_params Parameters
	 *     corresponding to the obsel to create.
	 * @param {String} obsel_params.type Type of the obsel.
	 * @param {Number} [obsel_params.begin] Timestamp of when the obsel starts
	 * @param {Number} [obsel_params.end] Timestamp of when the obsel ends
	 * @param {Object} [obsel_params.attributes] Attributes of the obsel.
	 * @param {Array<Relation>} [obsel_params.relations] Relations from this obsel.
	 * @param {Array<Relation>} [obsel_params.inverse_relations] Relations to this obsel.
	 * @param {Array<Obsel>} [obsel_params.source_obsels] Source obsels of the obsel.
	 * @param {String} [obsel_params.label] Label of the obsel.
	 */
	create_obsel: function(obsel_params) {
		obsel_params.id = this.count;
		this.count++;
		obsel_params.trace = this;
		var obs = new Samotraces.Obsel(obsel_params);
		this.obsel_list.push(obs);
		this.trigger('trace:create_obsel',obs);
	},
	/**
	 * @description
	 * Removes the given obsel from the trace
	 * @param {Obsel} obs Obsel to remove
	 */
	remove_obsel: function(obs) {
		this.obsel_list = this.obsel_list.filter(function(o) {
			return (o===obs)?false:true;
		});
		this.trigger('trace:remove_obsel',obs);
	},
	/**
	 * @todo TODO document this method
	 */
	transform: function(transformation_method,parameters) {
		return transformation_method(this,parameters);
	},
	/**
	 * @todo TODO document this method
	 */
	transformations: {
		duplicate: function(trace) {
			// TODO better deep copy
			var transformed_trace = new Samotraces.LocalTrace([trace]);
			trace.list_obsels().forEach(function(o) {
				transformed_trace.create_obsel(o.to_Object());
			});
			trace.on('trace:create_obsel',function(e) {
				var o = e.data;
				transformed_trace.create_obsel(o.to_Object());
			});
			return transformed_trace;
		},
		filter_obsel_type: function(trace,opt) {
			// TODO: implement
			// TODO better deep copy
console.log(opt);
			var transformed_trace = new Samotraces.LocalTrace([trace]);
			trace.list_obsels().forEach(function(o) {
				if(opt.types.some(function(type) {return type === o.get_obsel_type();})) {
					if(opt.mode === "keep") {
						transformed_trace.create_obsel(o.to_Object());
					}
				} else  {
					if(opt.mode === "remove") {
						transformed_trace.create_obsel(o.to_Object());
					}
				}
			});
			trace.on('trace:create_obsel',function(e) {
				var o = e.data;
				if(opt.types.some(function(type) {return type === o.get_obsel_type();})) {
					if(opt.mode === "keep") {
						transformed_trace.create_obsel(o.to_Object());
					}
				} else  {
					if(opt.mode === "remove") {
						transformed_trace.create_obsel(o.to_Object());
					}
				}
			});
			return transformed_trace;
		},
	},
};


