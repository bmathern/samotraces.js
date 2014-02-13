/**
 * @summary Javascript Ktbs Object that is bound to a KTBS. 
 * @class Javascript Ktbs Object that is bound to a KTBS. 
 * @author Benoît Mathern
 * @requires jQuery framework (see <a href="http://jquery.com">jquery.com</a>)
 * @constructor
 * @augments Samotraces.Lib.EventHandler
 * @description
 * Samotraces.Lib.Ktbs is a Javascript KTBS object that
 * is bound to a KTBS. This Object can be seen as an API to
 * the KTBS. Methods are available to get the list of bases
 * available in the KTBS. Access a specific base, etc.
 *
 * This class is a first (quick and dirty) attempt to access
 * a KTBS from Javascript.
 *
 * Note: this KTBS object is not an actual API to the KTBS.
 *
 * @todo update to a full JSON approach when the KTBS fully
 * supports JSON.
 *
 * @param {String}	url	Url of the KTBS to load.
 */
Samotraces.Lib.Ktbs = function(uri) {
//	this.url = url;
//	this.bases = [];
//	this.refresh();

	/* MIXIN */
	var Resource = (function(id,uri,label) {
		
		// RESOURCE API
		function get_id() { return this.id; }
		function get_uri() { return this.uri; }
		function force_state_refresh() {
			$.ajax({
				url: (this.traces)?this.uri+'.json':this.uri, // tweek to make it work with KTBS on bases with .json
				type: 'GET',
				dataType: 'json',
				success: this._on_state_refresh_.bind(this),
				error: function(jqXHR,textStatus,error) {
					console.log("Error in force_state_refresh():");
					console.log([jqXHR,textStatus,error]);
					if(textStatus == "parsererror") {
						console.log("--> parsererror -->");
						console.log(jqXHR.responseText);
					}
				}
			});
		}
		function start_auto_refresh(period) {
			this.auto_refresh_id?this.stop_auto_refresh():null;
			this.auto_refresh_id = window.setInterval(this.force_state_refresh.bind(this), period*1000);
		}
		function stop_auto_refresh() {
			if(this.auto_refresh_id) {
				window.clearInterval(this.auto_refresh_id);
				delete(this.auto_refresh_id);
			}
		}
//		function _on_state_refresh_(data) { this.data = data; console.log("here"); }
		function get_read_only() {}
		function remove() {
			function refresh_parent() {
				//TROUVER UN MOYEN MALIN DE RAFRAICHIR LA LISTE DES BASES DU KTBS...
			}
			$.ajax({
				url: this.uri,
				type: 'DELETE',
				success: refresh_parent.bind(this),
				error: function(jqXHR,textStatus,error) {
					console.log("Error in force_state_refresh():");
					console.log([jqXHR,textStatus,error]);
					if(textStatus == "parsererror") {
						console.log("--> parsererror -->");
						console.log(jqXHR.responseText);
					}
				}
			});
		}
		function get_label() {}
		function set_label() {}
		function reset_label() {}

		// ADDED FUNCTIONS
		function _check_change_(local_field,distant,message_if_changed) {
			if(this[local_field] !== distant) {
				this[local_field] = distant;
				this.trigger(message_if_changed);
			}
		}

		return function(id,uri) {
			// a Resource is an EventHandler
			Samotraces.Lib.EventHandler.call(this);
			// DOCUMENTED ABOVE
			// ATTRIBUTES
			this.id = id;
			this.uri = uri;
			this.label = label;
			// API METHODS
			this.get_id = get_id;
			this.get_uri = get_uri;
			this.force_state_refresh = force_state_refresh;
			this.get_read_only = get_read_only;
			this.remove = remove;
			this.get_label = get_label;
			this.set_label = set_label;
			this.reset_label = reset_label;
			// helper
			this._check_change_ = _check_change_;
			this.start_auto_refresh = start_auto_refresh;
			this.stop_auto_refresh = stop_auto_refresh;
			return this;
		};
	})();

	// KTBS is a Resource
	Resource.call(this,uri,uri,"");
	this.bases = [];
	this.builtin_methods = [];
	this.force_state_refresh();


	/**
	 * @class Javascript KtbsBase Object that is bound to a KTBS. 
	 * @author Benoît Mathern
	 * @requires jQuery framework (see <a href="http://jquery.com">jquery.com</a>)
	 * @constructor
	 * @augments Samotraces.Lib.EventHandler
	 * @description
	 * Samotraces.Lib.KtbsBase is a Javascript KTBS base
	 * object that is bound to a KTBS. This Object can be seen
	 * as an API to the KTBS. Methods are available to get the 
	 * list of traces available in the KTBS base. Access a 
	 * specific trace, etc.
	 *
	 * This class is a first (quick and dirty) attempt to access
	 * Bases from the KTBS.
	 *
	 * Note: this KtbsBase object is not an actual API to the KTBS.
	 *
	 * @todo update to a full JSON approach when the KTBS fully
	 * supports JSON.
	 *
	 * @param {String}	url	Url of the KTBS to load.
	 */
	var Base = function(id,uri) {
		// KTBS.Base is a Resource
		Resource.call(this,id,uri,"");
		this.traces = [];
		this.force_state_refresh();
	};
	this.Base = Base;

	Base.prototype = {
		get: function(id) {},
		list_traces: function() {
			return this.traces;
		},
		list_models: function() {},
		create_stored_trace: function(id,model,origin,default_subject,label) {
			var new_trace = {
				"@context":	"http://liris.cnrs.fr/silex/2011/ktbs-jsonld-context",
				"@type":	"StoredTrace",
				"@id":		id+"/"
			};
			new_trace.hasModel = (model==undefined)?"http://liris.cnrs.fr/silex/2011/simple-trace-model/":model;
			new_trace.origin = (origin==undefined)?"1970-01-01T00:00:00Z":origin;
//			if(origin==undefined) new_trace.origin = origin;
			if(default_subject==undefined) new_trace.default_subject = default_subject;
			if(label==undefined) new_trace.label = label;
			$.ajax({
				url: this.uri,
				type: 'POST',
				contentType: 'application/json',
				data: JSON.stringify(new_trace),
				success: this.force_state_refresh.bind(this),
				error: function(jqXHR,textStatus,error) {
					console.log('query error');
					console.log([jqXHR,textStatus,error]);
				}
			});
		},

	create_base: function(id, label) {
	},

		create_computed_trace: function(id,method,parameters,sources,label) {},
		create_model: function(id,parents,label) {},
		create_method: function(id,parent,parameters,label) {},
///////////
		_on_state_refresh_: function(data) {
		//	console.log(data);
			this._check_change_('label',data["http://www.w3.org/2000/01/rdf-schema#label"],'base:update');
			this._check_change_('traces', data.contains, 'base:update');
		},
/////////// ADDED / API
		get_trace: function(id) {
			return new Trace(id,this.uri+id);
		},
////////////
	};

	/**
	 * @class Javascript Trace Object that is bound to a KTBS trace. 
	 * @author Benoît Mathern
	 * @requires jQuery framework (see <a href="http://jquery.com">jquery.com</a>)
	 * @constructor
	 * @mixes Samotraces.Lib.EventHandler
	 * @description
	 * Samotraces.Lib.KtbsTrace is a Javascript Trace object
	 * that is bound to a KTBS trace. This Object can be seen as
	 * an API to the KTBS trace. Methods are available to get 
	 * the Obsels from the KTBS trace, create new Obsels, etc.
	 *
	 * This class is a first (quick and dirty) attempt to access
	 * Traces from the KTBS.
	 *
	 * Note: this Trace object is not an actual API to the KTBS.
	 * For instance, this class do not support transformations.
	 * Other example: new Obsels can be created on any trace.
	 * This Trace object do not take into accound error messages
	 * from the KTBS, etc.
	 *
	 * @todo update to a full JSON approach when the KTBS fully
	 * supports JSON.
	 *
	 * @param {String}	url	Url of the KTBS trace to load.
	 */
	var Trace = function(id,uri) {
		// KTBS.Base is a Resource
		Resource.call(this,id,uri,"");

		this.default_subject = "";
		this.model_uri = "";
		this.obsel_list_uri = "";
		this.base_uri = "";
		this.origin = "";
		this.obsel_list = []; this.traceSet = [];

		this.force_state_refresh();
	};
	this.Trace = Trace;

	Trace.prototype = {
/////////// OFFICIAL API
		get_base: function() {},
		get_model: function() {},
		get_origin: function() {},
		list_source_traces: function() {},
		list_transformed_traces: function() {},
		list_obsels: function(begin,end,reverse) {
			if(this.obsel_list_uri === "") {
				console.log("Error in Ktbs:Trace:list_obsels() unknown uri");
				return false;
			}
			$.ajax({
				url: this.obsel_list_uri,//+'.json',
				type: 'GET',
				dataType: 'json',
				data: {begin: begin, end: end, reverse: reverse},
				success: this._on_refresh_obsel_list_.bind(this)
			});
			return this.obsel_list.filter(function(o) {
				if(end && o.get_begin() > end) { return false; }
				if(begin && o.get_end() < begin) { return false; }
				return true;
			});
		},
		
		start_auto_refresh_obsel_list: function(period) {
			this.auto_refresh_obsel_list_id?this.stop_auto_refresh_obsel_list():null;
			this.auto_refresh_obsel_list_id = window.setInterval(this.list_obsels.bind(this), period*1000);
		},
		stop_auto_refresh_obsel_list: function() {
			if(this.auto_refresh_obsel_list_id) {
				window.clearInterval(this.auto_refresh_id);
				delete(this.auto_refresh_id);
			}
		},

		get_obsel: function(id) {},
///////////
		_on_state_refresh_: function(data) {
	//		console.log(data);
			this._check_change_('default_subject', data.hasDefaultSubject, '');
			this._check_change_('model_uri', data.hasModel, '');
			this._check_change_('obsel_list_uri', data.hasObselList, 'trace:update');
			this._check_change_('base_uri', data.inBase, '');
			this._check_change_('origin', data.origin, '');
		},
///////////
		_on_refresh_obsel_list_: function(data) {
	//		console.log(data);
			var id, label, type, begin, end, attributes, obs;
			var new_obsel_loaded = false;
			data.obsels.forEach(function(el,key) {
				id = el['@id'];
				label = el['http://www.w3.org/2000/01/rdf-schema#label'] || undefined;
				type = el['@type'];
				begin = el['begin'];
				end = el['end'];
				attributes = el;
				delete(attributes['@id']);
				delete(attributes['http://www.w3.org/2000/01/rdf-schema#label']);
				delete(attributes['@type']);
				delete(attributes['begin']);
				delete(attributes['end']);
				obs = new Obsel(id,this.uri+id,label,this.id,type,begin,end,attributes);
				
				if(! this._check_obsel_loaded_(obs)) {
					new_obsel_loaded = true;
				}
			},this);
			if(new_obsel_loaded) {
				this.trigger('trace:update',this.traceSet);
			}
		},
		_check_obsel_loaded_: function(obs) {
			if(this.obsel_list.some(function(o) {
				return o.get_id() == obs.get_id(); // first approximation: obsel has the same ID => it is already loaded... We don't check if the obsel has changed!
			})) {
				return true;
			} else {
				this.obsel_list.push(obs);
				this._compatibility_();
				return false;
			}
		},
///////////
		_compatibility_: function() {
			this.traceSet = this.obsel_list;
		}
	};
// */

	var Obsel = function(id,uri,label,trace,type,begin,end,attributes,relations) {
		// KTBS.Base is a Resource
		Resource.call(this,id,uri,label || "");
		this.trace = trace;
		this.type = type;
		this.begin = begin;
		this.end = end;
		this.attributes = attributes || {};
		this.relations = relations || {};
	}
	this.Obsel = Obsel;

	Obsel.prototype = {
		get_trace: function() { return this.trace; },
		get_obsel_type: function() { return this.type; },
		get_begin: function() { return this.begin; },
		get_end: function() { return this.end; },
		list_source_obsels: function() {},
		list_attribute_types: function() {},
		list_relation_types: function() {},
		list_related_obsels: function() {},
		list_inverse_relation_types: function() {},
		get_attribute_value: function() {},
		set_attribute_value: function() {},
		gel_attribute_value: function() {},
		add_related_obsel: function() {},
		del_related_obsel: function() {}
	};
};

Samotraces.Lib.Ktbs.prototype = {
/////////// OFFICIAL API
	list_builtin_methods: function() {},
	get_builtin_method: function() {},
	list_bases: function() {
		return this.bases;
	},
	/**
	 * @param id {String} URI of the base
	 */
	get_base: function(id) {
		return new this.Base(id,this.uri+id);
	},
	/**
	 * @param id {String} URI of the base (optional)
	 * @param label {String} Label of the base (optional)
	 */
	create_base: function(id, label) {
		var new_base = {
    		"@context":	"http://liris.cnrs.fr/silex/2011/ktbs-jsonld-context",
			"@type":	"Base",
			"@id":		id+"/",
			"label":	label
		};
		$.ajax({
			url: this.uri,
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(new_base),
			success: this.force_state_refresh.bind(this),
			error: function(jqXHR,textStatus,error) {
				console.log('query error');
				console.log([jqXHR,textStatus,error]);
			}
		});
	},
///////////
	_on_state_refresh_: function(data) {
	console.log(data);
		this._check_change_('bases', data.hasBase, 'ktbs:update');
		this._check_change_('builtin_methods', data.hasBuildinMethod, 'ktbs:update');
	},
///////////
};



