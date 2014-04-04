/**
 * @summary Trace object that is synchronised to a KTBS.
 * @class Javascript Trace Object that is bound to a KTBS trace. 
 * @author Benoît Mathern
 * @requires jQuery framework (see <a href="http://jquery.com">jquery.com</a>)
 * @constructor
 * @augments Samotraces.EventHandler
 * @augments Samotraces.KTBS.Resource
 * @description
 * Samotraces.KTBS.Trace is a Javascript Trace object
 * that is bound to a KTBS trace. This Object implements the KTBS API.
 * Methods are available to get 
 * the Obsels from the KTBS trace, create new Obsels, etc.
 *
 * Note: this Trace object does not implement all the methods
 * available in the KTBS API yet.
 * For instance, this class do not support transformations.
 *
 * @todo Fully implement KTBS API
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
	//this.origin_offset = (new Date(0)).getMilliseconds();
	this.obsel_list = []; this.traceSet = [];

	this.force_state_refresh();
};


Samotraces.KTBS.Trace.prototype = {
/////////// OFFICIAL API
	/**
	 * @description
	 * Gets the base where the trace is stored.
	 * @returns {String} URI of the base where the trace is stored.
	 */
	get_base: function() { return this.base_uri; },
	/**
	 * @description
	 * Gets the model of the trace.
	 * @returns {Model} Model of the trace.
	 * @todo DEFINE WHAT IS A MODEL
	 */
	get_model: function() { return this.model_uri; },
	/**
	 * @description
	 * Gets the origin of the trace.
	 * @returns {Origin} Origin of the trace.
	 * @todo DEFINE WHAT IS AN ORIGIN
	 */
	get_origin: function() { return this.origin; },
	//get_origin_offset: function() { return this.origin_offset; },
	/*ktbs_origin_to_ms: function(ktbs_date_str) {
		var Y = ktbs_date_str.substr(0,4);
		var M = ktbs_date_str.substr(5,2) - 1;
		var D = ktbs_date_str.substr(8,2);
		var h = ktbs_date_str.substr(11,2);
		var m = ktbs_date_str.substr(14,2);
		var s = ktbs_date_str.substr(17,2);
		var ms = ktbs_date_str.substr(20,3);
		return Date.UTC(Y,M,D,h,m,s,ms);
	},*/
	/**
	 * @todo METHOD NOT IMPLEMENTED
	 */
	list_source_traces: function() {},
	/**
	 * @todo METHOD NOT IMPLEMENTED
	 */
	list_transformed_traces: function() {},
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
	 * 
	 * Note: the list returned by this method is the
	 * list of Obsels that are loaded locally.
	 * When this method is called, a query to the KTBS
	 * is made to know if there are other Obsels matching
	 * the query. If so, these other obsels will be loaded
	 * in the local copy of the trace and a
	 * {@link Samotraces.Trace#trace:create:obsel|trace:create:obsel}
	 * event or a 
	 * {@link Samotraces.Trace#trace:update|trace:update}
	 * event will be triggered to notify that other
	 * Obsels have been loaded.
	 * @param {Number} [begin] Minimum time constraint
	 * @param {Number} [end] Maximum time constraint
	 * @param {Boolean} [reverse=false] Returns the obsel list in
	 *     reverse chronological order if true and in normal
	 *     chronological order if false.
	 * @returns {Array.<Obsel>} List of relevant obsels
	 * @todo REVERSE IS NOT YET TAKEN INTO ACCOUNT 
	 */
	// TODO add an optional CALLBACK???
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
	
	/**
	 * @summary Forces the local obsel list to be synchronised
	 * with the KTBS at a given refreshing rate.
	 * @param {Number} period Time in seconds between two synchronisations.
	 */
	start_auto_refresh_obsel_list: function(period) {
		this.auto_refresh_obsel_list_id?this.stop_auto_refresh_obsel_list():null;
		this.auto_refresh_obsel_list_id = window.setInterval(this.list_obsels.bind(this), period*1000);
	},
	/**
	 * @summary Stops the autorefresh synchronisation
	 * of the obsel list.
	 */
	stop_auto_refresh_obsel_list: function() {
		if(this.auto_refresh_obsel_list_id) {
			window.clearInterval(this.auto_refresh_id);
			delete(this.auto_refresh_id);
		}
	},

	/**
	 * Retrieve an obsel in the trace from its ID.
	 * If the obsel does not exist locally, returns
	 * undefined and send a query to the KTBS
	 * (which will result in adding this obsel locally
	 * if it exists on the KTBS).
	 * @param {String} id ID of the Obsel to retrieve
	 * @returns {Obsel} Obsel that corresponds to this ID
	 *     or undefined if the obsel was not found.
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
	/**
	 * Callback for queries where an obsel is expected as a result
	 * Parses the JSON data from the KTBS to create a new Obsel locally
	 * if it doesn't exist already.
	 * @private
	 */
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
	/**
	 * Overloads the {@link Samotraces.KTBS.Resouce#_on_state_refresh_} method.
	 * @private
	 */
	_on_state_refresh_: function(data) {
//		console.log(data);
		this._check_and_update_trace_type_(data['@type']);
		this._check_change_('default_subject', data.hasDefaultSubject, '');
		this._check_change_('model_uri', data.hasModel, '');
		this._check_change_('obsel_list_uri', data.hasObselList, 'trace:update');
		this._check_change_('base_uri', data.inBase, '');
		this._check_change_('origin', data.origin, '');
		//this._check_change_('origin_offset',this.ktbs_origin_to_ms(data.origin),'');
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
		set_origin: function(origin) {
			this.origin = origin;
		//	this.origin_offset = (new Date(origin)).getMilliseconds();
			// TODO sync with KTBS
		},
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

