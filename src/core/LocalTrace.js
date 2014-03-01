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

};

Samotraces.LocalTrace.prototype = {

	get_label: function() { return this.label; },
	set_label: function(lbl) {
		this.label = lbl;
		this.trigger('trace:edit:meta');
	},
	reset_label: function() {
		this.label = "";
		this.trigger('trace:edit:meta');
	},

	get_model: function() { return this.model; },
	get_origin: function() { return this.origin; },
	list_source_traces: function() { return this.source_traces; },
	list_transformed_traces: function() { return this.transformed_traces; },
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
	set_model: function(model) {
		this.model = model;
		this.trigger('trace:edit:meta');
	},
	set_origin: function(origin) {
		this.origin = origin;
		this.trigger('trace:edit:meta');
	},
	get_default_subject: function() { return this.subject;},
	set_default_subject: function(subject) {
		this.subject = subject;
		this.trigger('trace:edit:meta');
	},

	create_obsel: function(obsel_params) {
		obsel_params.id = this.count;
		this.count++;
		obsel_params.trace = this;
		var obs = new Samotraces.Obsel(obsel_params);
		this.obsel_list.push(obs);
		this.trigger('trace:create:obsel',obs);
	},
	remove_obsel: function(obs) {
		this.obsel_list = this.obsel_list.filter(function(o) {
			return (o===obs)?false:true;
		});
		this.trigger('trace:remove:obsel',obs);
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
			trace.on('trace:create:obsel',function(e) {
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
			trace.on('trace:create:obsel',function(e) {
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


