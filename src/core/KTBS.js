/**
 * @summary Javascript KTBS Object that is bound to a KTBS. 
 * @class Javascript KTBS Object that is bound to a KTBS. 
 * @author Benoît Mathern
 * @requires jQuery framework (see <a href="http://jquery.com">jquery.com</a>)
 * @constructor
 * @augments Samotraces.EventHandler
 * @augments Samotraces.KTBS.Resource
 * @description
 * Samotraces.KTBS is a Javascript KTBS object that
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
 * @param {String}	uri	URI of the KTBS to load.
 */
Samotraces.KTBS = function KTBS(uri) {
//	this.url = url;
//	this.bases = [];
//	this.refresh();


	// KTBS is a Resource
	Samotraces.KTBS.Resource.call(this,uri,uri,'KTBS',"");
	this.bases = [];
	this.builtin_methods = [];
	this.force_state_refresh();

};

Samotraces.KTBS.prototype = {
/////////// OFFICIAL API
	list_builtin_methods: function() {},
	get_builtin_method: function() {},
	list_bases: function() {
		return this.bases;
	},
	/**
	 * @summary Returns the KTBS.Base with the given ID.
	 * @returns Samotraces.KTBS.Base Base corresponding to the given ID
	 * @param id {String} URI of the base
	 */
	get_base: function(id) {
		return new Samotraces.KTBS.Base(this.uri+id,id);
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

/**
 * @summary Resource Objects have an uri, an id and an optional label
 * @class Resource Objects have an uri, an id and an optional label
 * @param {String} id Id of the Resource
 * @param {String} url URI of the Resource
 * @param {String} type Type of the Resource ('KTBS','Base',
 *     'Trace','StoredTrace','ComputedTrace' or 'Obsel')
 * @param {label} [label] Label of the Resource
 */
Samotraces.KTBS.Resource = (function() {
	/**
	 * @summary Returns the resource type of the Resource.
	 * @memberof Samotraces.KTBS.Resource.prototype
	 * @returns {String} Resource type ('KTBS','Base',
	 *     'Trace','StoredTrace','ComputedTrace' or 'Obsel').
	 */
	function get_resource_type() { return this.type; }

	// RESOURCE API
	/**
	 * @summary Returns the ID of the Resource.
	 * @memberof Samotraces.KTBS.Resource.prototype
	 * @returns {String} Resource ID.
	 */
	function get_id() { return this.id; }
	/**
	 * @summary Returns the URI of the Resource. 
	 * @memberof Samotraces.KTBS.Resource.prototype
	 * @returns {String} Resource URI.
	 */
	function get_uri() { return this.uri; }
	/**
	 * @summary Forces the Resource to synchronise with the KTBS.
	 * @memberof Samotraces.KTBS.Resource.prototype
	 * @description
	 * Forces the Resource to synchronise with the KTBS.
	 * This method triggers a Ajax query that will
	 * trigger the _on_state_refresh_ method of the Resource 
	 * on success.
	 */
	function force_state_refresh() {
		
		$.ajax({
			url: this.uri,
			type: 'GET',
			dataType: 'json',
			error: (function(jqXHR, textStatus, errorThrown) {
console.log("error",this);
				Samotraces.log("Cannot refresh "+this.get_resource_type()+" " + this.uri + ": ", textStatus + ' ' + JSON.stringify(errorThrown));
			}).bind(this),
			success: this._on_state_refresh_.bind(this),
		/*	error: function(jqXHR,textStatus,error) {
				console.log("Error in force_state_refresh():");
				console.log([jqXHR,textStatus,error]);
				if(textStatus == "parsererror") {
					console.log("--> parsererror -->");
					console.log(jqXHR.responseText);
				}
			}*/
		});
	}
	/**
	 * @summary Forces the Resource to synchronise 
	 * with at a given refreshing rate.
	 * @memberof Samotraces.KTBS.Resource.prototype
	 * @description
	 * Forces the Resource to synchronise with the KTBS
	 * every period seconds.
	 * @param {Number} period Time in seconds between two synchronisations.
	 */
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
                 throw "Cannot delete "+this.get_resource_type()+" " + this.uri + ": " + textStatus + ' ' + JSON.stringify(errorThrown);
			}
		});
	}
	function get_label() { return this.label; }
	function set_label() {}
	function reset_label() {}

	// ADDED FUNCTIONS
	function _check_change_(local_field,distant,message_if_changed) {
		// TODO check if this is the wanted behaviour:
		// If distant is undefined -> what to do?
		if(distant !== undefined && this[local_field] !== distant) {
			this[local_field] = distant;
			this.trigger(message_if_changed);
		}
	}

	return function(id,uri,type,label) {
		// a Resource is an EventHandler
		Samotraces.EventHandler.call(this);
		// DOCUMENTED ABOVE
		// ATTRIBUTES
		this.id = id;
		this.uri = uri;
		this.label = label;
		this.type = type;
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
		this.get_resource_type = get_resource_type;
		this._check_change_ = _check_change_;
		this.start_auto_refresh = start_auto_refresh;
		this.stop_auto_refresh = stop_auto_refresh;
		return this;
	};
})();


/**
 * @class Javascript KTBS.Base Object that is bound to a KTBS. 
 * @author Benoît Mathern
 * @requires jQuery framework (see <a href="http://jquery.com">jquery.com</a>)
 * @constructor
 * @augments Samotraces.EventHandler
 * @description
 * Samotraces.KTBS.Base is a Javascript KTBS base
 * object that is bound to a KTBS. This Object can be seen
 * as an API to the KTBS. Methods are available to get the 
 * list of traces available in the KTBS base. Access a 
 * specific trace, etc.
 *
 * This class is a first (quick and dirty) attempt to access
 * Bases from the KTBS.
 *
 * Note: this KTBS.Base object is not an actual API to the KTBS.
 *
 * @todo update to a full JSON approach when the KTBS fully
 * supports JSON.
 *
 * @param {String}	uri	URI of the Base to load.
 * @param {String}	[id]	ID of the Base to load.
 */
Samotraces.KTBS.Base = function Base(uri,id) {
	// KTBS.Base is a Resource
	if(id === undefined) { id = uri; }
	Samotraces.KTBS.Resource.call(this,id,uri,'Base',"");
	this.traces = [];
	this.force_state_refresh();
};

Samotraces.KTBS.Base.prototype = {
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
		new_trace.hasModel = (model==undefined)?"http://liris.cnrs.fr/silex/2011/simple-trace-model":model;
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
		return new Samotraces.KTBS.Trace(this.uri+id+'/',id);
	},
////////////
};

/**
 * @class Javascript Trace Object that is bound to a KTBS trace. 
 * @author Benoît Mathern
 * @requires jQuery framework (see <a href="http://jquery.com">jquery.com</a>)
 * @constructor
 * @mixes Samotraces.EventHandler
 * @description
 * Samotraces.KTBS.Trace is a Javascript Trace object
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
 * @param {String}	uri	URI of the KTBS trace to load.
 * @param {String}	[id]	ID of the KTBS trace to load.
 */
Samotraces.KTBS.Trace = function Trace(uri,id) {
	// KTBS.Trace is a Resource
	if(id === undefined) { id = uri; }
	Samotraces.KTBS.Resource.call(this,id,uri,'Base',"");

	this.temp = {}; // attribute used to store actions made by the user on the trace while not knowing if they are allowed. e.g., create_obsel, when we don't know yet if the Trace is a StoredTrace because the KTBS didn't reply yet.

	this.default_subject = "";
	this.model_uri = "";
	this.obsel_list_uri = "";
	this.base_uri = "";
	this.origin = "";
	this.obsel_list = []; this.traceSet = [];

	this.force_state_refresh();
};

//Samotraces.KTBS.Trace.prototype = Samotraces.LocalTrace.prototype;


Samotraces.KTBS.Trace.prototype = {
/////////// OFFICIAL API
	get_base: function() { return this.base_uri; },
	get_model: function() { return this.model_uri; },
	get_origin: function() { return this.origin; },
	list_source_traces: function() {},
	list_transformed_traces: function() {},
	// @todo TODO add an optional CALLBACK
	list_obsels: function(begin,end,reverse) {
		if(this.obsel_list_uri === "") {
			console.log("Error in KTBS:Trace:list_obsels() unknown uri");
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

	/**
	 * Retrieve an obsel in the trace from its ID.
	 * @param {String} id ID of the Obsel to retrieve
	 * @returns {Obsel} Obsel that corresponds to this ID
	 *     or undefined if the obsel was not found.
	 * @todo TODO if undefined -> send a query to the KTBS
	 * @todo TODO add an optional CALLBACK
	 */	
	get_obsel: function(id) {
		var obs;
		this.obsel_list.forEach(function(o) {
			if(o.get_id() == id) { obs = o; }
		});
		if(obs === undefined) {
			// sends a query to find the obsel
			jQuery.ajax({
					// TODO ideally JSON... When KTBS supports it!
					url: this.uri+id, 
					dataType: 'json',
					type: 'GET',
					success: this._parse_get_obsel_.bind(this),
				});
		}
		return obs;
	},
	_parse_get_obsel_: function(data,textStatus,jqXHR) {
		var obs = {
			attributes: {}
		};

		// OBSEL ID
		obs.id = data["@id"];
		if(obs.id.substr(0,2) == "./") { obs.id = obs.id.substr(2); }
		
		// OBSEL TRACE
		// data.hasTrace;
		obs.trace = this;

		// OBSEL TYPE
		// data["@type"]; // TODO BUG KTBS -> USE "m:type" instead
		// data["m:type"];
		obs.type = data["@type"].substr(2);
	
		if(data.hasOwnProperty('http://www.w3.org/2000/01/rdf-schema#label')) {
			obs.label = data['http://www.w3.org/2000/01/rdf-schema#label'];
		}
		obs.begin = data.begin;
		obs.end = data.end;
		
		// DELETING PROPERTIES THAT HAVE ALREADY BEEN COPIED
		delete data["@id"];
		delete data.hasTrace;
		delete data["@type"];
		delete data.begin;
		delete data.end;
		delete data['http://www.w3.org/2000/01/rdf-schema#label'];
		//delete data["m:type"];
		
			
		// ATTRIBUTES
		for(var attr in data) {
			if(attr.substr(0,2) == "m:") { // TODO this is not generic!!!!
				obs.attributes[attr.substr(2)] = data[attr];
			}
		}
	//console.log(data,obs);
		var o = new Samotraces.KTBS.Obsel(obs);
		if(!this._check_obsel_loaded_(o)) { // TODO first approximation
			this.trigger('trace:create_obsel',o);
		}
	},

///////////
	_on_state_refresh_: function(data) {
//		console.log(data);
		this._check_and_update_trace_type_(data['@type']);
		this._check_change_('default_subject', data.hasDefaultSubject, '');
		this._check_change_('model_uri', data.hasModel, '');
		this._check_change_('obsel_list_uri', data.hasObselList, 'trace:update');
		this._check_change_('base_uri', data.inBase, '');
		this._check_change_('origin', data.origin, '');
	},
	_update_method_: function(trace_type,method_name) {
		this[method_name] = this[trace_type+"_methods"][method_name];
		if(this.temp[method_name] !== undefined) {
			Samotraces.debug("Unfilling calls to method "+method_name);
			this.temp[method_name].forEach(function(param) {
				this[method_name](param);
			},this);
		}
	},
	_check_and_update_trace_type_: function(type) {
		if(this.type !== type) {
			Samotraces.debug("Trace type = "+type);
			for(var method_name in this[type+"_methods"]) {
				this._update_method_(type,method_name);
			}
			this.type = type;
		}
	},
///////////
	_on_refresh_obsel_list_: function(data) {
//		console.log(data);
		var id, label, type, begin, end, attributes, obs;
		var new_obsel_loaded = false;
		data.obsels.forEach(function(el,key) {
			this._parse_get_obsel_(el);
/*
			var attr = {};
			attr.id = el['@id'];
			attr.trace = this;
			attr.label = el['http://www.w3.org/2000/01/rdf-schema#label'] || undefined;
			attr.type = el['@type'];
			attr.begin = el['begin'];
			attr.end = el['end'];
			attr.attributes = el;
			delete(attr.attributes['@id']);
			delete(attr.attributes['http://www.w3.org/2000/01/rdf-schema#label']);
			delete(attr.attributes['@type']);
			delete(attr.attributes['begin']);
			delete(attr.attributes['end']);
			obs = new Samotraces.KTBS.Obsel(attr);
			
			if(! this._check_obsel_loaded_(obs)) {
				new_obsel_loaded = true;
			}
*/
		},this);
/*		if(new_obsel_loaded) {
			this.trigger('trace:update',this.traceSet);
		}
*/
	},
	_check_obsel_loaded_: function(obs) {
		if(this.obsel_list.some(function(o) {
			return o.get_id() == obs.get_id(); // first approximation: obsel has the same ID => it is already loaded... We don't check if the obsel has changed!
		})) {
			return true;
		} else {
			this.obsel_list.push(obs);
			return false;
		}
	},
	StoredTrace_methods: {
		set_model: function(model) {},
		set_origin: function(origin) {},
		get_default_subject: function() { return this.default_subject; },
		set_default_subject: function(subject) {},
		create_obsel: function(params) {
			// LOCAL TRACE
			//var obs = new Samotraces.Obsel(obsel_params);
			// KTBS BOGUE
			var json_obsel = {
				"@context":	[
					"http://liris.cnrs.fr/silex/2011/ktbs-jsonld-context",
       					{ "m": "http://liris.cnrs.fr/silex/2011/simple-trace-model#" }
				],
				"@type":	"m:"+params.type, // fixed: "SimpleObsel", // TODO KTBS BUG TO FIX
				hasTrace:	"",
				subject:	params.hasOwnProperty("subject")?params.subject:this.get_default_subject(),
				//"m:type":	params.type
			};
			//console.log(params.hasOwnProperty("subject")?params.subject:this.get_default_subject(),params.hasOwnProperty("subject"),params.subject,this.get_default_subject());
			if(params.hasOwnProperty("begin")) { json_obsel.begin=params.begin; }
			if(params.hasOwnProperty("end")) { json_obsel.begin=params.end;}
			if(params.hasOwnProperty("attributes")) {
				for(var attr in params.attributes) {
					json_obsel["m:"+attr] = params.attributes[attr];
				}
			}
			function _on_create_obsel_success_(data,textStatus,jqXHR) {
				/*
				var url = jqXHR.getResponseHeader('Location');
				var url_array = url.split('/');
				*/
				var url_array = data.split('/');
				var obsel_id = url_array[url_array.length -1];
				//this.get_obsel(obsel_id);
				// Optimisation: do not do a GET query to get the OBSEL
				// The Obsel parameters are already known in param
				// We just need to add the ID.
				params.id = obsel_id;
				params.trace = this;
				var o = new Samotraces.KTBS.Obsel(params);
				if(!this._check_obsel_loaded_(o)) {
					this.trigger('trace:create_obsel',o);
				}
			}
			jQuery.ajax({
					url: this.uri,
					type: 'POST',
					contentType: 'application/json',
					success: _on_create_obsel_success_.bind(this),
					data: JSON.stringify(json_obsel)
				});
		}
	},

	ComputedTrace_methods: {
		set_method: function(method) {},
		list_parameters: function(include_inherited) {},
		get_parameter: function(key) {},
		set_parameter: function(key, value) {},
		del_parameter: function(key) {}
	},

	// TEMPORARY METHODS	
	create_obsel: function(obsel_params) {
		Samotraces.debug("Trace type not know yet -> file the call to create_obsel()");
		if(!this.create_obsel.hasOwnProperty('create_obsel')) {
			this.temp.create_obsel = [];
		}
		this.temp.create_obsel.push[obsel_params];
	},

};



/**
 * @augments Samotraces.Obsel
 * @todo TODO update set_methods
 * -> sync with KTBS instead of local change
 */
Samotraces.KTBS.Obsel = function Obsel(param) {
	// KTBS.Base is a Resource
	Samotraces.KTBS.Resource.call(this,param.id,param.uri,'Obsel',param.label || "");

	this._private_check_error(param,'trace');
	this._private_check_error(param,'type');
	this._private_check_default(param,'begin',	Date.now());
	this._private_check_default(param,'end',		this.begin);
	this._private_check_default(param,'attributes',	{});
	this._private_check_undef(param,'relations',	[]); // TODO ajouter rel à l'autre obsel
	this._private_check_undef(param,'inverse_relations',	[]); // TODO ajouter rel à l'autre obsel
	this._private_check_undef(param,'source_obsels',		[]);
}

Samotraces.KTBS.Obsel.prototype = Samotraces.Obsel.prototype;

/*
Samotraces.KTBS.Obsel.prototype.get_ktbs_status = function() {
	return this.ktbs_status
};
*/


