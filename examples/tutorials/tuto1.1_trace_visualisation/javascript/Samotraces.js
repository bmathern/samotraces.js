
(function(factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define('samotraces',['jquery'], factory);
    } else {
        // Browser globals
        window.Samotraces = factory(jQuery);
    }
}(function ($) {
	/**
	 * Library of the Objects of Samotraces
	 * @namespace Samotraces
	 */
	var Samotraces = {};
	/**
	 * @property {Boolean} [debug=false]
	 */
	var debug_mode = false;
	Samotraces.set_debug = function(val) { debug_mode = val; };

	/**
	 * Library of UI components for Samotraces
	 * @namespace Samotraces.UI
	 */
	Samotraces.UI = {};
	/**
	 * Set of Widgets of Samotraces
	 * @namespace Samotraces.UI.Widgets
	 */
	Samotraces.UI.Widgets = {};

	Samotraces.log = function log() {
		if(window.console) {
            window.console.log.apply(console, [ "Samotraces.js" ].concat([].slice.call(arguments)));
		}
	};
	Samotraces.debug = function debug() {
		if(debug_mode && window.console) {
            window.console.log.apply(console, [ "Samotraces.js-debug" ].concat([].slice.call(arguments)));
		}
	};
	

// first: core/KTBS.js
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
 * is bound to a KTBS. This Object implemetns the KTBS API.
 * Methods are available to get the list of bases
 * available in the KTBS. Access a specific base, etc.
 *
 * @param {String}	uri	URI of the KTBS to load.
 */
Samotraces.KTBS = function KTBS(uri) {
	// KTBS is a Resource
	Samotraces.KTBS.Resource.call(this,uri,uri,'KTBS',"");
	this.bases = [];
	this.builtin_methods = [];
	this.force_state_refresh();
};

Samotraces.KTBS.prototype = {
/////////// OFFICIAL API
	/**
	 * @todo METHOD NOT IMPLEMENTED
	 */
	list_builtin_methods: function() {},
	/**
	 * @todo METHOD NOT IMPLEMENTED
	 */
	get_builtin_method: function() {},
	/**
	 * Returns the array of the URI of the bases contained in the KTBS
	 * @returns {Array<String>} Array of URI of bases.
	 */
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
	 * Create a new base.
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
	/**
	 * Overloads the {@link Samotraces.KTBS.Resouce#_on_state_refresh_} method.
	 * @private
	 */
	_on_state_refresh_: function(data) {
	console.log(data);
		this._check_change_('bases', data.hasBase, 'ktbs:update');
		this._check_change_('builtin_methods', data.hasBuildinMethod, 'ktbs:update');
	},
};


// first: core/Obsel.js
/**
 * Obsel is a shortname for the 
 * {@link Samotraces.Obsel}
 * object.
 * @typedef Obsel
 * @see Samotraces.Obsel
 */

/**
 * ObselParam is an object that contains parameters
 * necessary to create a new obsel.
 * This type of object is used in several methods
 * such as the Obsel constructor, or the
 * Trace.create_obsel method.
 * The optional porperties varies depending on the
 * method called.
 * @typedef ObselParam
 * @property {String} [id] Id of the obsel
 * @property {Trace} [trace] Trace of the obsel
 * @property {String} [type] Type of the obsel
 * @property {Number} [begin] Timestamp of when the obsel starts
 * @property {Number} [end] Timestamp of when the obsel ends
 * @property {Object} [attributes] Attributes of the obsel.
 * @property {Array<Relation>} [relations] Relations from this obsel.
 * @property {Array<Relation>} [inverse_relations] Relations to this obsel.
 * @property {Array<Obsel>} [source_obsels] Source obsels of the obsel.
 * @property {String} [param.label] Label of the obsel.
 * @todo FIXME DEFINE WHAT IS A RELATION
 */

/**
 * @summary JavaScript Obsel class
 * @class JavaScript Obsel class
 * @param {ObselParam} param Parameters of the obsel
 * @param {String} param.id Identifier of the obsel.
 * @param {Trace} param.Trace Trace of the obsel.
 * @param {String} param.type Type of the obsel.
 * @param {Number} [param.begin=Date.now()] Timestamp of when the obsel starts
 * @param {Number} [param.end=param.begin] Timestamp of when the obsel ends
 * @param {Object} [param.attributes] Attributes of the obsel.
 * @param {Array<Relation>} [param.relations] Relations from this obsel.
 * @param {Array<Relation>} [param.inverse_relations] Relations to this obsel.
 * @param {Array<Obsel>} [param.source_obsels] Source obsels of the obsel.
 * @param {String} [param.label] Label of the obsel.
 * @todo FIXME RELATIONS ARE NOT YET SUPPORTED
 */
// *
Samotraces.Obsel = function Obsel(param) {
	this._private_check_error(param,'id');
	this._private_check_error(param,'trace');
	this._private_check_error(param,'type');
	this._private_check_default(param,'begin',	Date.now());
	this._private_check_default(param,'end',		this.begin);
	this._private_check_default(param,'attributes',	{});
	this._private_check_undef(param,'relations',	[]); // TODO ajouter rel à l'autre obsel
	this._private_check_undef(param,'inverse_relations',	[]); // TODO ajouter rel à l'autre obsel
	this._private_check_undef(param,'source_obsels',		[]);
	this._private_check_undef(param,'label',		"");
};

Samotraces.Obsel.prototype = {
	// ATTRIBUTES
	attributes: {},
	relations: [],
	inverse_relations: [],
	source_obsels: [],
	label: "",
	/**
	 * If attribute exists, then set the class attribute
	 * of the same name to the attribute value, otherwise
	 * set the attribute of the same name with the default
	 * value.
	 * @param {Object} param Object from which attribute is copied
	 * @param {String} attr Name of the attribute
	 * @param value Default value
	 * @private
	 */
	_private_check_default: function(param,attr,value) {
		this[attr] = (param[attr] !== undefined)?param[attr]:value;
	},
	/**
	 * If attribute exists, then set the class attribute
	 * of the same name to the attribute value, otherwise
	 * nothing happens.
	 * @param {Object} param Object from which attribute is copied
	 * @param {String} attr Name of the attribute
	 * @private
	 */
	_private_check_undef: function(param,attr) {
		if(param[attr] !== undefined) {
			this[attr] = param[attr];
		}
	},
	/**
	 * If attribute exists, then set the class attribute
	 * of the same name to the attribute value, otherwise
	 * throw an error.
	 * @param {Object} param Object from which attribute is copied
	 * @param {String} attr Name of the attribute
	 * @private
	 */
	_private_check_error: function(param,attr) {
		if(param[attr] !== undefined) {
			this[attr] = param[attr];
		} else {
			throw "Parameter "+attr+" required.";
		}
	},
	// RESOURCE
	/**
	 * @summary
	 * Remove the obsel from its trace.
	 * @description
	 * Remove the obsel from its trace.
	 * The trace will trigger a 
	 * {@link Samotraces.Trace#trace:remove_obsel} event
	 */
	remove: function() {
		this.get_trace().remove_obsel(this);
	},
	/**
	 * @summary
	 * Returns the id of the Obsel.
	 * @returns {String} Id of the obsel.
	 */
	get_id: function() { return this.id; },
	/**
	 * @summary
	 * Returns the label of the Obsel.
	 * @returns {String} Label of the obsel.
	 */
	get_label: function() { return this.label; },
	/**
	 * @summary
	 * Sets the label of the Obsel.
	 * @param {String} Label of the obsel.
	 */
	set_label: function(lbl) { this.label = lbl; },
	/**
	 * @summary
	 * Sets the label of the Obsel to the empty string.
	 */
	reset_label: function() { this.label = ""; },
	// OBSEL
	/**
	 * @summary
	 * Returns the trace the Obsel belongs to.
	 * @returns {Trace} Trace the Obsel belongs to.
	 */
	get_trace: 		function() { return this.trace; },
	/**
	 * @summary
	 * Returns the type of the Obsel.
	 * @returns {String} Type of the obsel.
	 * @todo TODO differs from KTBS API -> express it clearly
	 */
	get_type: function() { return this.type; },
	/**
	 * Returns the time when the Obsel starts.
	 * @returns {Number} Time when the Obsel starts.
	 */
	get_begin: 		function() { 
		//return this.get_trace().get_origin_offset() + this.begin;
		return this.begin;
	},
	/**
	 * @summary
	 * Returns the time when the Obsel ends.
	 * @returns {Number} Time when the Obsel ends.
	 */
	get_end: 		function() {
		//return this.get_trace().get_origin_offset() + this.end;
		return this.end;
	},
	/**
	 * @summary
	 * Sets the type of the Obsel.
	 * @description
	 * Sets the type of the Obsel.
	 * The trace will trigger a 
	 * {@link Samotraces.Trace#trace:edit_obsel} event
	 * @params {String} type Type of the obsel.
	 * @todo TODO not KTBS API compliant
	 * @deprecated This method might not be supported in the future.
	 */
	force_set_obsel_type: function(type) {
		this.type = type;
		this.trace.trigger('trace:edit_obsel',this);
	},
	/**
	 * @summary
	 * Sets the time when the Obsel starts.
	 * @description
	 * Sets the time when the Obsel starts.
	 * The trace will trigger a 
	 * {@link Samotraces.Trace#trace:edit_obsel} event
	 * @params {Number} begin Time when the Obsel starts.
	 * @todo TODO not KTBS API compliant
	 * @deprecated This method might not be supported in the future.
	 */
	force_set_begin: function(begin) {
		this.begin = begin;
		this.trace.trigger('trace:edit_obsel',this);
	},
	/**
	 * @summary
	 * Sets the time when the Obsel ends.
	 * @description
	 * Sets the time when the Obsel ends.
	 * The trace will trigger a 
	 * {@link Samotraces.Trace#trace:edit_obsel} event
	 * @params {Number} end Time when the Obsel ends.
	 * @todo TODO not KTBS API compliant
	 * @deprecated This method might not be supported in the future.
	 */
	force_set_end: 	function(end) {
		this.end = end;
		this.trace.trigger('trace:edit_obsel',this);
	},
	/**
	 * @summary
	 * Returns the source Obsels of the current Obsel.
	 * @returns {Array<Obsel>} Source Obsels of the current Obsel.
	 */
	list_source_obsels: 	function() {
		if(this.list_source_obsels === undefined) { return []; }
		return this.source_obsels;
	},
	/**
	 * @summary
	 * Returns the attribute names of the Obsel.
	 * @returns {Array<String>} Attribute names of the Obsel.
	 */
	list_attribute_types: 	function() {
		if(this.attributes === undefined) { return []; }
		var attrs = []
		for(var key in this.attributes) { attrs.push(key); }
		return attrs;
	},
	/**
	 * @summary
	 * Returns the relation types of the Obsel.
	 * @returns {Array<String>} Relation types of the Obsel.
	 * @todo TODO Check how it is supposed to work in KTBS API
	 */
	list_relation_types: 	function() {
		if(this.relations === undefined) { return []; }
		var rels = [];
		this.relations.forEach(function(r) {
			var uniqueNames = [];
    		if($.inArray(r.type, rels) === -1) {
				rels.push(r.type);
			}
		});
		return rels;
	},
	/**
	 * @summary
	 * Returns the Obsels related to the current Obsel with the given relation type.
	 * @param {String} relation_type Relation type.
	 * @returns {Array<Obsel>} Obsels related to the current Obsel.
	 * @todo TODO Check how it is supposed to work in KTBS API
	 */
	list_related_obsels: 	function(relation_type) {
		var obss = [];	
		if(this.relations !== undefined) {
			this.relations.forEach(function(r) {
				var uniqueNames = [];
				if(r.type === relation_type) {
					obss.push(r.obsel_to);
				}
			});
		}
		if(this.inverse_relations !== undefined) {
			this.inverse_relations.forEach(function(r) {
				var uniqueNames = [];
				if(r.type === relation_type) {
					obss.push(r.obsel_to);
				}
			});
		}
		return obss;
	},
	/**
	 * @summary
	 * Returns the inverse relation types of the Obsel.
	 * @returns {Array<String>} Inverse relation types of the Obsel.
	 * @todo TODO Check how it is supposed to work in KTBS API
	 */
	list_inverse_relation_types: function() {
		if(this.inverse_relations === undefined) { return []; }
		var rels = [];
		this.inverse_relations.forEach(function(r) {
			var uniqueNames = [];
    		if($.inArray(r.type, rels) === -1) {
				rels.push(r.type);
			}
		});
		return rels;
	},
//	del_attribute_value:	function(attr) {}, // TODO erreur de l'API KTBS?
	/**
	 * @summary
	 * Returns the value of an attribute.
	 * @param {String} attr Attribute name.
	 * @returns {Object} Attribute value.
	 * @todo TODO Check consistency with KTBS API
	 */
	get_attribute:	function(attr) {
		if(this.attributes[attr] === undefined) {
			throw "Attribute "+attr+" is not defined"; // TODO
		} else {
			return this.attributes[attr];
		}
	},
//	del_attribute_value:	function(attr) {}, // TODO erreur de l'API KTBS?
	/**
	 * @summary
	 * Sets the value of an attribute.
	 * @param {String} attr Attribute name.
	 * @param {Object} val Attribute value.
	 * @todo TODO Check consistency with KTBS API
	 */
	set_attribute:	function(attr, val) {
		this.attributes[attr] = val;
		this.trace.trigger('trace:edit_obsel',this);
		// TODO envoyer un event pour dier que l'obsel a changé
	},
//	del_attribute_value:	function(attr) {}, // TODO erreur de l'API KTBS?
	/**
	 * @summary
	 * Removes the attribute with the given name.
	 * @description
	 * Removes the attribute with the given name.
	 * The trace will trigger a 
	 * {@link Samotraces.Trace#trace:edit_obsel} event
	 * @todo TODO Check consistency with KTBS API.
	 * @param {String} attr Attribute name.
	 */
	del_attribute:			function(attr) {
		delete this.attributes[attr];
		this.trace.trigger('trace:edit_obsel',this);
		// TODO envoyer un event pour dier que l'obsel a changé
	},
	/**
	 * @summary
	 * Adds a relation with an Obsel.
	 * @description
	 * NOT YET IMPLEMENTED
	 * @param {String} rel Relation type.
	 * @param {Obsel} obs Target Obsel.
	 * @todo TODO Check consistency with KTBS API
	 */
	add_related_obsel:		function(rel,obs) {
		// TODO
		throw "method not implemented yet";
		// TODO envoyer un event pour dier que l'obsel a changé
	},
	/**
	 * @summary
	 * Removes a relation with an Obsel.
	 * @description
	 * NOT YET IMPLEMENTED
	 * @param {String} rel Relation type.
	 * @param {Obsel} obs Target Obsel.
	 * @todo TODO Check consistency with KTBS API
	 */
	del_related_obsel:		function(rel,obs) {
		// TODO
		throw "method not implemented yet";
		// TODO envoyer un event pour dier que l'obsel a changé
	},

	// NOT IN KTBS API
	/**
	 * @summary
	 * Copies the Obsel properties in an Object.
	 * @description
	 * Copies the Obsel properties in an Object
	 * that can be used to create an Obsel with
	 * {@link Samotraces.Obsel#Obsel} constructor or
	 * {@link Samotraces.Trace#create_obsel} method.
	 * @returns {Object} Object that
	 */
	to_Object: function() {
		var obj = {
			id: this.id,
			type: this.type,
			begin: this.begin,
			end: this.end,
			attributes: {},
			// use .slice to copy
			// TODO is it enough? <- might create bugs
			relations: this.relations.slice(),
			inverse_relations: this.inverse_relations.slice(),
			source_obsels: this.source_obsels.slice(),
			label: this.label
		};
		// copy each attributes
		for(var attr in this.attributes) {
			obj.attributes[attr] = this.attributes[attr];
		}
		return obj;
	},
};



// last: core/EventHandler.js
/**
 * @mixin
 * @description
 * The EventHandler Object is not a class. However, it is 
 * designed for other classes to inherit of a predefined
 * Observable behaviour. For this reason, this function is
 * documented as a Class. 
 * 
 * In order to use create a class that "inherits" from the 
 * "EventHandler class", one must run the following code in 
 * the constructor:
 * <code>
 * Samotraces.EventHandler.call(this);
 * </code>
 *
 * @property {Object} callbacks
 *     Hash matching callbacks to event_types.
 */
Samotraces.EventHandler = (function() {
	/**
	 * Triggers all the registred callbacks.
	 * @memberof Samotraces.EventHandler.prototype
	 * @param {String} event_type
	 *     The type of the triggered event.
	 * @param {Object} object
	 *     Object sent with the message to the listeners (see 
	 *     {@link Samotraces.EventHandler#on}).
	 */
	function trigger(event_type,object) {
		Samotraces.debug("EventHandler#"+event_type+" triggered");
		var e = { type: event_type, data: object };
		if(this.callbacks[event_type]) {
			this.callbacks[event_type].map(function(f) { f(e); });
		}
		/*
		this.callbacks[event_type].forEach(function(callback) {
			callback(e);
		});
		*/
	}
	/**
	 * Adds a callback for the specified event
	 * @memberof Samotraces.EventHandler.prototype
	 * @param {String} event_type
	 *     The type of the event to listen to.
	 * @param {Function} callback
	 *     Callback to call when the an event of type 
	 *     event_type is triggered. Note: the callback
	 *     can receive one argument that contains
	 *     details about the triggered event.
	 *     This event argument contains two fields:
	 *     event.type: the type of event that is triggered
	 *     event.data: optional data that is transmitted with the event
	 */
	function on(event_type,callback) {
		if({}.toString.call(callback) !== '[object Function]') {
			console.log(callback);
			throw "Callback for event "+event_type+" is not a function";
		}
		this.callbacks[event_type] = this.callbacks[event_type] || [];
		this.callbacks[event_type].push(callback);
	}

	return function(events) {
		// DOCUMENTED ABOVE
		this.callbacks = this.callbacks || {};
		this.trigger = trigger;
		this.on = on;	
		/**
		 * EventConfig is a shortname for the 
		 * {@link Samotraces.EventHandler.EventConfig}
		 * object.
		 * @typedef EventConfig
		 * @see Samotraces.EventHandler.EventConfig
		 */
		/**
		 * The EventConfig object is used for configurating the
		 * functions to call events are triggered by an EventHandler Object.
		 * Each attribute name of the EventConfig corresponds
		 * to a type of event listened to, and each
		 * value is the function to trigger on this event.
		 * @typedef Samotraces.EventHandler.EventConfig
		 * @type {Object.<string, function>}
		 * @property {function} eventName - Function to trigger on this event.
		 */
		for(var event_name in events) {
			var fun = events[event_name];
			this.on(event_name,function(e) { fun(e.data); });
		}
		return this;
	};
})();




// last: core/KTBS.Base.js
/**
 * @class Javascript KTBS.Base Object that is bound to a KTBS. 
 * @author Benoît Mathern
 * @requires jQuery framework (see <a href="http://jquery.com">jquery.com</a>)
 * @constructor
 * @augments Samotraces.EventHandler
 * @augments Samotraces.KTBS.Resource
 * @description
 * Samotraces.KTBS.Base is a Javascript KTBS base
 * object that is bound to a KTBS. This Object implements the KTBS API.
 * Methods are available to get the 
 * list of traces available in the KTBS base. Access a 
 * specific trace, etc.
 *
 * @todo Fully implement KTBS API
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
	/**
	 * Gets the list of traces available in the base.
	 * @returns {Array.<String>} Array of the ID of the traces available in the Base.
	 */
	list_traces: function() {
		return this.traces;
	},
	/**
	 * @todo METHOD NOT IMPLEMENTED
	 */
	list_models: function() {},
	/**
	 * Create a stored trace in the KTBS
	 * @param id {String} ID of the created trace
	 * @param [model] {Model} Model of the trace
	 * @param [origin] {Origin} Origin of the trace
	 * @param [default_subject] {String} Default subject of the trace
	 * @param [label] {String} Label of the trace
	 */
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

	/**
	 * @todo METHOD NOT IMPLEMENTED
	 */
	create_computed_trace: function(id,method,parameters,sources,label) {},
	/**
	 * @todo METHOD NOT IMPLEMENTED
	 */
	create_model: function(id,parents,label) {},
	/**
	 * @todo METHOD NOT IMPLEMENTED
	 */
	create_method: function(id,parent,parameters,label) {},
///////////
	/**
	 * Overloads the {@link Samotraces.KTBS.Resouce#_on_state_refresh_} method.
	 * @private
	 */
	_on_state_refresh_: function(data) {
	//	console.log(data);
		this._check_change_('label',data["http://www.w3.org/2000/01/rdf-schema#label"],'base:update');
		this._check_change_('traces', data.contains, 'base:update');
	},
/////////// ADDED / API
	/**
	 * Gets a trace from its ID
	 * @param id {String} ID of the trace to get.
	 * @return {Samotraces.KTBS.Trace} The retrieved Trace.
	 */
	get_trace: function(id) {
		return new Samotraces.KTBS.Trace(this.uri+id+'/',id);
	},
////////////
};


// last: core/KTBS.Obsel.js
/**
 * @class Samotraces.KTBS.Obsel is part of the Samotraces.KTBS implementation.
 * @augments Samotraces.Obsel
 * @augments Samotraces.KTBS.Resource
 * @todo TODO update set_methods
 * -> sync with KTBS instead of local change
 */
Samotraces.KTBS.Obsel = function Obsel(param) {
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


// last: core/KTBS.Resource.js
/**
 * @summary Resource Objects that is synchronised to a kTBS
 * @description Resource Objects are KTBS objects. All resources
 * have an uri, an id and an optional label
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
		console.log(this.uri);	
		//$.getJSON(this.uri,this._on_state_refresh_.bind(this));	
		$.ajax({
			url: this.uri,
			type: 'GET',
			dataType: 'json',
			error: (function(jqXHR, textStatus, errorThrown) {
console.log("error",this);
console.log(textStatus,errorThrown);
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
	/**
	 * @summary Stops the autorefresh synchronisation
	 * of the Resource.
	 * @memberof Samotraces.KTBS.Resource.prototype
	 * @description
	 * Stops the autorefresh synchronisation of
	 * the Resource.
	 */
	function stop_auto_refresh() {
		if(this.auto_refresh_id) {
			window.clearInterval(this.auto_refresh_id);
			delete(this.auto_refresh_id);
		}
	}
//		function _on_state_refresh_(data) { this.data = data; console.log("here"); }
	/**
	 * @todo METHOD NOT IMPLEMENTED
	 */
	function get_read_only() {}
	/**
	 * @summary Delete the resource from the KTBS
	 * @todo IMPROVE THIS METHOD SO THAT PROPER EVENT IS RAISED
	 *     WHEN A RESOURCE IS DELETED.
	 */
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
	/**
	 * @summary Returns the label of the Resource
	 */
	function get_label() { return this.label; }
	/**
	 * @todo METHOD NOT IMPLEMENTED
	 */
	function set_label() {}
	/**
	 * @todo METHOD NOT IMPLEMENTED
	 */
	function reset_label() {}

	// ADDED FUNCTIONS
	/**
	 * Method used to check if the distant value is different
	 * from the current local value (and update the local value
	 * if there is a difference.
	 * @private
	 * @param local_field {String} Name of the field of the this 
	 *     object containing the information to check.
	 * @param distant {Value} Value of the distant information.
	 * @param message_if_changed {String} Message to trigger if
	 *     the information has been updated.
	 */
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


// last: core/KTBS.Trace.js
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
//		$.getJSON(this.obsel_list_uri,this._on_refresh_obsel_list_.bind(this));
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


// last: core/LocalTrace.js
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
				} else {
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
				} else {
					if(opt.mode === "remove") {
						transformed_trace.create_obsel(o.to_Object());
					}
				}
			});
			return transformed_trace;
		},
	},
};



// last: core/Selector.js
/**
 * Selector is a shortname for the 
 * {@link Samotraces.Selector}
 * object.
 * @typedef Selector
 * @see Samotraces.Selector
 */
/**
 * @summary Object that stores a selection of objects
 * @class Object that stores a selection of objects
 * @author Benoît Mathern
 * @constructor
 * @augments Samotraces.EventHandler
 * @fires Samotraces.Selector#selection:add
 * @fires Samotraces.Selector#selection:remove
 * @fires Samotraces.Selector#selection:empty
 * @description
 * The {@link Samotraces.Selector|Selector} object
 * is a Javascript object that stores a selection of Objects.
 * This Object stores Objects that are selected and informs 
 * widgets or other objects (via the 
 * triggered events) when the selection changes.
 * When first instanciated, the selection is empty.
 *
 * In order to select an object, the 
 * {@link Samotraces.Selector#select|Selector#select()} 
 * method has to be called.
 * Similarly, in order to unselect an object, the 
 * {@link Samotraces.Selector#unselect|Selector#unselect()} 
 * method has to be called.
 * The whole selection can be emptied at once with the 
 * {@link Samotraces.Selector#empty|Selector#empty()}
 * method.
 * 
 * @param {string} type - A string describing the type of
 *     object to be selected ('Obsel', 'Trace', 'TimeWindow', etc.). 
 * @param {string} [selection_mode='single'] 
 *     In 'single' mode, the selection contains one object maximum.
 *     This means that adding an object to a non-empty selection
 *     will replace the previously selected object with the new one.
 *     In 'multiple' mode, the selection can be extended and objects
 *     can be individually added or removed.
 * @param {EventConfig}	[events]
 *     Events to listen to and their corresponding callbacks.
 */
Samotraces.Selector = function(type,selection_mode,events) {
	// Adding the Observable trait
	Samotraces.EventHandler.call(this,events);
	this.mode = selection_mode || 'single'; // other option is 'multiple'
	this.type = type;
	this.selection = [];
	// TODO: ajouter eventListener sur Trace si type = obsel
	// -> Quand "trace:remove:obsel" -> vérifie si un obsel a
	// été supprimé de la sélection.
};

Samotraces.Selector.prototype = {
	/**
	 * Method to call to select an Object.
	 * @param {Object} object
	 *     Object to add to the selection
	 * @fires Samotraces.Selector#selection:add
	 */
	select: function(object) {
		if(this.mode === 'multiple') {
			this.selection.push(object);
		} else {
			this.selection = [object];
		}
		/**
		 * Object selected event.
		 * @event Samotraces.Selector#selection:add
		 * @type {object}
		 * @property {String} type - The type of the event (= "selection:add").
		 * @property {Object} data - The selected object.
		 */
		this.trigger('selection:add',object);
	},
	/**
	 * Method to empty the current selection.
	 * @fires Samotraces.Selector#selection:empty
	 */
	empty: function() {
		this.selection = [];
		/**
		 * Object unselected event.
		 * @event Samotraces.Selector#selection:empty
		 * @type {object}
		 * @property {String} type - The type of the event (= "selection:empty").
		 */
		this.trigger('selection:empty');
	},
	/**
	 * Method that checks if the selection is empty
	 * @returns {Boolean} Returns true if the selection and empty 
	 *     and false if the selection is not empty.
	 */
	is_empty: function() {
		return (this.selection.length === 0);
	},
	/**
	 * Gets the current selection
	 * @returns {Array} Array of selected objects
	 */
	get_selection: function() {
		return this.selection;
	},
	/**
	 * Method to call to remove an Object from the selection.
	 * @param {Object} object
	 *     Object to remove from the selection
	 * @fires Samotraces.Selector#selection:remove
	 */
	unselect: function(object) {
		if(this.mode === 'multiple') {
			var found = false;
			this.selection = this.selection.filter(function(el) {
				if(el === object) {
					found = true;	
					return false;
				} else {
					return true;
				}
			});
			if(!found) { return false; }
		} else {
			this.selection = [];
		}
		/**
		 * Object unselected event.
		 * @event Samotraces.Selector#selection:remove
		 * @type {object}
		 * @property {String} type - The type of the event (= "selection:remove").
		 */
		this.trigger('selection:remove',object);
		return true;
	},
	/**
	 * Method to call to toggle the selection of an Object.
	 * If the Object was previously unselected, it becomes selected.
	 * If the Object was previously selected, it becomes unselected.
	 * @param {Object} object
	 *     Object to toggle from the selection
	 */
	toggle: function(object) {
		if(this.mode === 'multiple') {
			if(!this.unselect(object)) {
				this.select(object);
			}
		} else {
			if(this.selection.length == 0 || this.selection[0] !== object) {
				this.select(object);
			} else {
				this.unselect(object);
			}
		}
	}
};


// last: core/TimeWindow.js
/**
 * TimeWindow is a shortname for the 
 * {@link Samotraces.TimeWindow}
 * object.
 * @typedef TimeWindow
 * @see Samotraces.TimeWindow
 */
/**
 * @summary Object that stores the current time window
 * @class Object that stores the current time window
 * @author Benoît Mathern
 * @constructor
 * @augments Samotraces.EventHandler
 * @description
 * The {@link Samotraces.TimeWindow} object is a Javascript Object
 * that stores the current time window.
 * This Object stores a time window and informs widgets or other
 * objects when the time window changes via the 
 * {@link Samotraces.TimeWindow#tw:update|tw:update}
 * event.
 * A {@link Samotraces.TimeWindow|TimeWindow} can be defined in two ways:
 *
 * 1.  by defining a lower and upper bound
 * 2.  by defining a timer and a width.
 *
 * @param {Object} opt	Option parameter that defines the time
 *     window. Variables opt.start and opt.end must 
 *     be defined if using lower and upper bound definition.
 *     Variables opt.timer and opt.width must 
 *     be defined if using timer and width definition.
 * @param {Number} opt.start Starting time of the time window (lower bound).
 * @param {Number} opt.end Ending time of the time window (upper bound).
 * @param {Samotraces.Timer} opt.timer Timer object, which time
 *     is used to define the middle of the current time window.
 * @param {Number} opt.width Width of the time window.
 *
 */
Samotraces.TimeWindow = function TimeWindow(opt) {
	// Adding the Observable trait
	Samotraces.EventHandler.call(this);
	if(opt.start !== undefined && opt.end  !== undefined) {
		this.start = opt.start;
		this.end = opt.end;
		this.__calculate_width();
	} else if (opt.timer !== undefined && opt.width  !== undefined) {
		this.set_width(opt.width,opt.timer.time)
		this.timer = opt.timer;
		this.timer.on('timer:update',this._private_updateTime.bind(this));
		this.timer.on('timer:play:update',this._private_updateTime.bind(this));
	} else {
		throw('Samotraces.TimeWindow error. Arguments could not be parsed.');
	}
};

Samotraces.TimeWindow.prototype = {
	__calculate_width: function() {
		this.width = this.end - this.start;
	},
	_private_updateTime: function(e) {
		var time = e.data;
		var delta = time - (this.start + this.width/2);

		this.start = time - this.width/2
		this.end = time + this.width/2
		this.trigger('tw:translate',delta);

//		this.set_width(this.width,time);
	},
	/** 
	 * Sets the start time of the time window.
	 * @param {Number} time Starting time of the time window.
	 * @fires Samotraces.TimeWindow#tw:update
	 */
	set_start: function(time) {
		if(this.start != time) {
			this.start = time;
			this.__calculate_width();
			/**
			 * Time window change event.
			 * @event Samotraces.TimeWindow#tw:update
			 * @type {object}
			 * @property {String} type - The type of the event (= "tw:update").
			 */
			this.trigger('tw:update');
		}
	},
	/**
	 * Sets the end time of the time window.
	 * @param {Number} time Ending time of the time window.
	 * @fires Samotraces.TimeWindow#tw:update
	 */
	set_end: function(time) {
		if(this.end != time) {
			this.end = time;
			this.__calculate_width();
			this.trigger('tw:update');
		}
	},
	/**
	 * Gets the width of the time window (duration between start and end)
	 * @returns {Number} Width of the time window
	 */
	get_width: function() {
		return this.width;
	},
	/**
	 * Sets the width of the time of the time window.
	 * @param {Number} width New width of the time window.
	 * @param {Number} [center=(start+end)/2] New center of the time window.
	 * @fires Samotraces.TimeWindow#tw:update
	 */
	set_width: function(width,center) {
		if( center === undefined) {
			center = this.start + this.width/2;
		}
		this.start = center - width/2;
		this.end = center + width/2;
		this.width = width;
		this.trigger('tw:update');
	},
	/**
	 * Translates the time window with a time delta.
	 * @param {Number} delta Time deltat that will be added to the time window.
	 * @fires Samotraces.TimeWindow#tw:translate
	 */
	translate: function(delta) {
		if(this.timer) {
			this.timer.set(this.timer.time + delta);
		} else {
			this.start = this.start + delta;
			this.end = this.end + delta;
			this.trigger('tw:translate',delta);
		}
	},
	/**
	 * Zooms the timewindow by multiplying the current width
	 * by the given coefficient. Zoom in if the coefficient
	 * is less than 1 and out if it is more than 1.
	 * @param {Number} coef Coefficient of the zoom to apply.
	 */
	zoom: function(coef) {
		this.set_width(this.width*coef);
	},
};


// last: core/Timer.js
/**
 * @summary Object that stores the current time
 * @class Object that stores the current time
 * @author Benoît Mathern
 * @constructor
 * @augments Samotraces.EventHandler
 * @fires Samotraces.Timer#timer:update
 * @description
 * Samotraces.Timer is a Javascript object that stores
 * the current time.
 * This Object stores a time and informs widgets or other
 * objects when the time changes.
 *
 * @param {Number} [init_time=0] 
 *     Initial time of the timer (optional, default: 0).
 * @param {Number} [period=2000] 
 *     Perdiod (in ms) at which the timer will update itself in
 *     "play" mode.
 * @param {function} [update_function]
 *     Function called to update the timer when in "play" mode
 *     (function that returns the value of 
 *     <code>Date.now()</code> by default).
 */

Samotraces.Timer = function Timer(init_time,period,update_function) {
	// Adding the Observable trait
	Samotraces.EventHandler.call(this);
	this.time = init_time || 0;
	this.period = period || 2000;
	this.update_function = update_function || function() {return Date.now();};
	this.is_playing = false;
};

Samotraces.Timer.prototype = {
	/**
	 * Sets the Timer to the given time.
	 * @fires Samotraces.Timer#timer:update
	 * @param {Number} time New time
	 */
	set_time: function(time) {
		new_time = Number(time);
		if(this.time != new_time) {
			this.time = new_time; 
			/**
			 * Time change event.
			 * @event Samotraces.Timer#timer:update
			 * @type {object}
			 * @property {String} type - The type of the event (= "timer:update").
			 */
			this.trigger('timer:update',this.time);
		}
	},
	/**
	 * Sets the Timer to the given time.
	 * @deprecated Use {@link Samotraces.Timer.set_time|set_time} instead.
	 * @fires Samotraces.Timer#timer:update
	 * @param {Number} time New time
	 */
	set: function(t) { return this.set_time(t); },
	/**
	 * Gets the current time of the Timer
	 * @returns {Number} Current time of the Timer.
	 */
	get_time: function(time) {
		return this.time;
	},
	/**
	 * Sets or get the Timer's current time.
	 * If no parameter is given, the current time is returned.
	 * Otherwise, sets the Timer to the givent time.
	 * @fires Samotraces.Timer#timer:update
	 * @param {Number} [time] New time
	 */
	time: function(time) {
		if(time) {
			new_time = Number(time);
			if(this.time != new_time) {
				this.time = new_time; 
				this.trigger('timer:update',this.time);
			}
		} else {
			return this.time;
		}
	},

	/**
	 * Starts the play mode: the timer will be updated
	 * according to the update_function every period
	 * as specified at the initialisation of the Timer.
	 * @todo SPECIFY WAYS TO CHANGE PERIOD AND UPDATE_FUNCTIOn
	 */
	play: function() {
		var update = function() {
			this.time = this.update_function(this.time);
			/**
			 * Time change event (actualising time when playing)
			 * @event Samotraces.Timer#timer:play:update
			 * @type {object}
			 * @property {String} type 
			 *     - The type of the event (= "timer:play:update").
			 */
			this.trigger('timer:play:update',this.time);
		};
		this.interval_id = window.setInterval(this.update_function.bind(this),this.period);
		this.is_playing = true;
		this.trigger('timer:play',this.time);
	},
	/**
	 * Stops the play mode.
	 */
	pause: function() {
		window.clearInterval(this.interval_id);
		this.is_playing = false;
		this.trigger('timer:pause',this.time);
	}
};


// last: core/Trace.js
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


// last: UI/Widgets/ImportTrace.js
/**
 * @summary Widget for importing a trace from a CSV file.
 * @class Widget for importing a trace from a CSV file.
 * @author Benoît Mathern
 * @constructor
 * @augments Samotraces.UI.Widgets.Widget
 * @see Samotraces.UI.Widgets.Basic.ImportTrace
 * @todo ATTENTION code qui vient d'ailleurs !
 * @description
 * The {@link Samotraces.UI.Widgets.Basic.ImportTrace} widget is a generic
 * Widget to import a trace from a CSV file.
 * 
 * This widget currently accept the following format:
 *
 * 1. The CSV file can use either ',' or ';' as a value separator
 * 2. Each line represents an obsel
 * 3. The first column represents the time when the obsel occurs
 * 4. The second column represents the type of the obsel
 * 5. The following columns represent pairs of "attribute" / "value" columns
 *
 * The number of columns may vary from line to line.
 * For example, a CSV file might look like this:
 * <pre>
 * 0,click,target,button2
 * 2,click,target,button1,value,toto
 * 3,focus,target,submit
 * 5,click,target,submit
 * </pre>
 * @todo DESCRIBE THE FORMAT OF THE CSV FILE.
 * @param {String}	html_id
 *     Id of the DIV element where the widget will be
 *     instantiated
 * @param {Samotraces.Trace} trace
 *     Trace object in which the obsels will be imported.
 */
Samotraces.UI.Widgets.ImportTrace = function(html_id,trace) {
	// WidgetBasicTimeForm is a Widget
	Samotraces.UI.Widgets.Widget.call(this,html_id);

	this.trace = trace;

	this.init_DOM();
};

Samotraces.UI.Widgets.ImportTrace.prototype = {
	init_DOM: function() {

		var p_element = document.createElement('p');

		var text_node = document.createTextNode('Import a trace: ');
		p_element.appendChild(text_node);

		this.input_element = document.createElement('input');
		this.input_element.setAttribute('type','file');
		this.input_element.setAttribute('name','csv-file[]');
		this.input_element.setAttribute('multiple','true');
//		this.input_element.setAttribute('size',15);
//		this.input_element.setAttribute('value',this.timer.time);
		p_element.appendChild(this.input_element);

//		var submit_element = document.createElement('input');
//		submit_element.setAttribute('type','submit');
//		submit_element.setAttribute('value','Import');
//		p_element.appendChild(submit_element);

		this.form_element = document.createElement('form');
		this.input_element.addEventListener('change', this.on_change.bind(this));

		this.form_element.appendChild(p_element);
		this.element.appendChild(this.form_element);

		var button_el = document.createElement('p');
		var a_el = document.createElement('a');
		a_el.href = "";
		a_el.innerHTML = "toggle console";
		button_el.appendChild(a_el);
//		button_el.innerHTML = "<a href=\"\">toggle console</a>";
		a_el.addEventListener('click',this.on_toggle.bind(this));
		this.element.appendChild(button_el);

		this.display_element = document.createElement('div');
		this.display_element.style.display = 'none';
		this.element.appendChild(this.display_element);

	},

	on_change: function(e) {
		files = e.target.files;
		var title_el,content_el;
		for( var i=0, file; file = files[i]; i++) {
			title_el = document.createElement('h2');
			title_el.appendChild(document.createTextNode(file.name));
			this.display_element.appendChild(title_el);
			content_el = document.createElement('pre');
			var reader = new FileReader();
			reader.onload = (function(el,parser,trace) {
				return function(e) {
					parser(e.target.result,trace);
					el.appendChild(document.createTextNode(e.target.result));
				};
			})(content_el,this.parse_csv,this.trace);
/*			reader.onprogress = function(e) {
				console.log(e);
			};*/
			reader.readAsText(file);
			this.display_element.appendChild(content_el);		
		}
	},

	on_toggle: function(e) {
		e.preventDefault();
		if(this.display_element.style.display == 'none') {
			this.display_element.style.display = 'block';
		} else {
			this.display_element.style.display = 'none';
		}
		return false;
	},
	parse_csv: function(text,trace) {
		
//function CSVToArray() from 
// http://stackoverflow.com/questions/1293147/javascript-code-to-parse-csv-data

		// This will parse a delimited string into an array of
		// arrays. The default delimiter is the comma, but this
		// can be overriden in the second argument.
		function CSVToArray( strData, strDelimiter ){
			// Check to see if the delimiter is defined. If not,
			// then default to comma.
			strDelimiter = (strDelimiter || ",");

			// Create a regular expression to parse the CSV values.
			var objPattern = new RegExp(
				(
					// Delimiters.
					"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

					// Quoted fields.
					"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

					// Standard fields.
					"([^\"\\" + strDelimiter + "\\r\\n]*))"
				),
				"gi"
				);


			// Create an array to hold our data. Give the array
			// a default empty first row.
			var arrData = [[]];

			// Create an array to hold our individual pattern
			// matching groups.
			var arrMatches = null;


			// Keep looping over the regular expression matches
			// until we can no longer find a match.
			while (arrMatches = objPattern.exec( strData )){

				// Get the delimiter that was found.
				var strMatchedDelimiter = arrMatches[ 1 ];

				// Check to see if the given delimiter has a length
				// (is not the start of string) and if it matches
				// field delimiter. If id does not, then we know
				// that this delimiter is a row delimiter.
				if (
					strMatchedDelimiter.length &&
					(strMatchedDelimiter != strDelimiter)
					){

					// Since we have reached a new row of data,
					// add an empty row to our data array.
					arrData.push( [] );

				}


				// Now that we have our delimiter out of the way,
				// let's check to see which kind of value we
				// captured (quoted or unquoted).
				if (arrMatches[ 2 ]){

					// We found a quoted value. When we capture
					// this value, unescape any double quotes.
					var strMatchedValue = arrMatches[ 2 ].replace(
						new RegExp( "\"\"", "g" ),
						"\""
						);

				} else {

					// We found a non-quoted value.
					var strMatchedValue = arrMatches[ 3 ];

				}


				// Now that we have our value string, let's add
				// it to the data array.
				arrData[ arrData.length - 1 ].push( strMatchedValue );
			}

			// Return the parsed data.
			return( arrData );
		}
		
	//	console.log('fichier chargé');
		// guessing the separator
		var sep = text[text.search('[,;\t]')];
		csv = CSVToArray(text,sep);
		csv.pop(); // remove the last line... Why?...
	//	console.log('fichier parsé');
		csv.map(function(line) {
			var o_attr = {};
			o_attr.begin = line.shift();
			o_attr.type = line.shift();
			o_attr.attributes = {};
			for( var i=0; i < (line.length-1)/2 ; i++) {
				if(line[2*i] != "") {
					o_attr.attributes[line[2*i]] = line[2*i+1];
				}
			}
		//	console.log('new obsel');
			trace.create_obsel(o_attr);
		});		
/*
		var output = "";
		csv.forEach(function(line) {
			output += line.join(";")+" ";
		});
		return output;
*/
	}

};


// last: UI/Widgets/ObselInspector.js
/**
 * @summary Widget for visualising an Obsel as an HTML list.
 * @class Widget for visualising an Obsel as an HTML list.
 * @author Benoît Mathern
 * @constructor
 * @mixes Samotraces.UI.Widgets.Widget
 * @description
 * Samotraces.UI.Widgets.ObselInspector is a generic
 * Widget to visualise Obsels.
 * 
 * This widget observes a {@link Samotraces.Lib.Selector|Selector}
 * object. When an obsel is selected, the information about
 * this obsel is displayed in the widget. When an obsel is
 * unselected, the widget closes. Clicking on the red cross
 * will close the widget (and automatically unselect the obsel).
 * When no obsel are selected, the widget is not visible,
 * selecting an obsel will make it appear.
 *
 * @param {String}	html_id
 *     Id of the DIV element where the widget will be
 *     instantiated
 * @param {Selector.<Obsel>} obsel_selector
 *     A Selector of Obsel to observe.
 */
Samotraces.UI.Widgets.ObselInspector = function(html_id,obsel_selector) {
	// WidgetBasicTimeForm is a Widget
	Samotraces.UI.Widgets.Widget.call(this,html_id);
	this.add_class('Widget-ObselInspector');

	this.obsel = obsel_selector;
	this.obsel.on('selection:add',this.inspect.bind(this));
	this.obsel.on('selection:empty',this.close.bind(this));
	this.obsel.on('selection:remove',this.close.bind(this));

	this.init_DOM();
};

Samotraces.UI.Widgets.ObselInspector.prototype = {
	init_DOM: function() {

		this.close_element = document.createElement('span');
		var img_element = document.createElement('img');
		img_element.setAttribute('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAFPSURBVDiNlZOxTgJREEXPfUuPEmyMrQSLJaHWhCiltYX/oZ2VscLKr6CgpgOMRn/ARRAtiTYYsVd2LFjIstklcZqXzMy5M5mZpxEUf+HC4ARoO7jeM3sjxV6kUjjPPRQ0c9DQMzQMzmN5nyEc+WZBHA4k30EPKC58ghv1YQzsJIqtiKTBkX04wW1Kt0UHvb5U6UuVDBigrSGUQngw2EpGDb6jVjeSMcFEsC8zI5B8D7ppImkmmMyg7psFDsA3C2ZQF0z+AwPIzJbBaFh3wGYGPw2hFt+Qi0c98JTwJao7D7y4b5k8kKo2n0M+S8Agb9AdSNUVgQjuAIUsOGYFg85CRE9QdvCYAU+jN20mXwYHzoOzNFgwCaEWQi1jOwXBhfrwDmwn4fiq1tzJ2Ala62BYeydNjaD4M/+Npwb3Obgsm72mtMxQ2g3nuceCVg6u/gBs54alonwdWQAAAABJRU5ErkJggg==');
		this.close_element.appendChild(img_element);
		this.element.appendChild(this.close_element);

		this.datalist_element = document.createElement('ul');
		this.element.appendChild(this.datalist_element);

		this.element.style.display = 'none';

		this.close_element.addEventListener('click',this.onCloseAction.bind(this));
	},
	inspect: function(event) {
		var obs = event.data;
		// clear
		this.datalist_element.innerHTML = '';

		var attributes = obs.attributes;
		
		var li_element = document.createElement('li');
		li_element.appendChild(document.createTextNode('id: '+ obs.get_id()));
		this.datalist_element.appendChild(li_element);

		li_element = document.createElement('li');
		li_element.appendChild(document.createTextNode('type: '+ obs.get_type()));
		this.datalist_element.appendChild(li_element);

		li_element = document.createElement('li');
		li_element.appendChild(document.createTextNode('begin: '+ obs.get_begin()));
	//	li_element.appendChild(document.createTextNode('begin: '+ (new Date(obs.get_begin())).toString()));
		this.datalist_element.appendChild(li_element);

		li_element = document.createElement('li');
		li_element.appendChild(document.createTextNode('end: '+ obs.get_end()));
	//	li_element.appendChild(document.createTextNode('end: '+ (new Date(obs.get_end())).toString()));
		this.datalist_element.appendChild(li_element);

		for(var key in obs.attributes) {
			li_element = document.createElement('li');
			li_element.appendChild(document.createTextNode(key  +': '+ obs.attributes[key]));
			this.datalist_element.appendChild(li_element);
		}

		this.element.style.display = 'block';
	},
	close: function() {
		this.element.style.display = 'none';
	},
	onCloseAction: function() {
		this.obsel.unselect();
	}
};




// last: UI/Widgets/ReadableTimeForm.js
/**
 * @summary Widget for visualising the current time as a date/time.
 * @class Widget for visualising the current time as a date/tim.
 * @author Benoît Mathern
 * @constructor
 * @mixes Samotraces.Widgets.Widget
 * @see Samotraces.UI.Widgets.TimeForm
 * @description
 * Samotraces.UI.Widgets.ReadableTimeForm is a generic
 * Widget to visualise the current time.
 *
 * The time (in ms from the 01/01/1970) is converted in a
 * human readable format (as opposed to
 * {@link Samotraces.Widgets.TimeForm} widget
 * which display raw time).
 * 
 * This widget observes a Samotraces.Lib.Timer object.
 * When the timer changes the new time is displayed.
 * This widget also allow to change the time of the timer.
 * 
 * @param {String}	html_id
 *     Id of the DIV element where the widget will be
 *     instantiated
 * @param {Samotraces.Timer} timer
 *     Timer object to observe.
 */
Samotraces.UI.Widgets.ReadableTimeForm = function(html_id,timer) {
	// WidgetBasicTimeForm is a Widget
	Samotraces.UI.Widgets.Widget.call(this,html_id);

	this.add_class('Widget-ReadableTimeForm');

	this.timer = timer;
	this.timer.on('timer:update',this.refresh.bind(this));
	this.timer.on('timer:play:update',this.refresh.bind(this));

	this.init_DOM();
	this.refresh({data: this.timer.time});
};

Samotraces.UI.Widgets.ReadableTimeForm.prototype = {
	init_DOM: function() {

		var p_element = document.createElement('p');

		var text_node = document.createTextNode('Current time: ');
		p_element.appendChild(text_node);


		this.year_element = document.createElement('input');
		this.year_element.setAttribute('type','text');
		this.year_element.setAttribute('name','year');
		this.year_element.setAttribute('size',4);
		this.year_element.setAttribute('value','');
		p_element.appendChild(this.year_element);
		p_element.appendChild(document.createTextNode('/'));

		this.month_element = document.createElement('input');
		this.month_element.setAttribute('type','text');
		this.month_element.setAttribute('name','month');
		this.month_element.setAttribute('size',2);
		this.month_element.setAttribute('value','');
		p_element.appendChild(this.month_element);
		p_element.appendChild(document.createTextNode('/'));

		this.day_element = document.createElement('input');
		this.day_element.setAttribute('type','text');
		this.day_element.setAttribute('name','day');
		this.day_element.setAttribute('size',2);
		this.day_element.setAttribute('value','');
		p_element.appendChild(this.day_element);
		p_element.appendChild(document.createTextNode(' - '));

		this.hour_element = document.createElement('input');
		this.hour_element.setAttribute('type','text');
		this.hour_element.setAttribute('name','hour');
		this.hour_element.setAttribute('size',2);
		this.hour_element.setAttribute('value','');
		p_element.appendChild(this.hour_element);
		p_element.appendChild(document.createTextNode(':'));

		this.minute_element = document.createElement('input');
		this.minute_element.setAttribute('type','text');
		this.minute_element.setAttribute('name','minute');
		this.minute_element.setAttribute('size',2);
		this.minute_element.setAttribute('value','');
		p_element.appendChild(this.minute_element);
		p_element.appendChild(document.createTextNode(':'));

		this.second_element = document.createElement('input');
		this.second_element.setAttribute('type','text');
		this.second_element.setAttribute('name','second');
		this.second_element.setAttribute('size',8);
		this.second_element.setAttribute('value','');
		p_element.appendChild(this.second_element);
/*
		this.input_element = document.createElement('input');
		this.input_element.setAttribute('type','text');
		this.input_element.setAttribute('name','');
		this.input_element.setAttribute('size',15);
		this.input_element.setAttribute('value',this.timer.time);
		p_element.appendChild(this.input_element);
*/
		var submit_element = document.createElement('input');
		submit_element.setAttribute('type','submit');
		submit_element.setAttribute('value','Update time');
		p_element.appendChild(submit_element);

		this.form_element = document.createElement('form');
		this.form_element.addEventListener('submit', this.build_callback('submit'));

		this.form_element.appendChild(p_element);

		this.element.appendChild(this.form_element);
	},

	refresh: function(e) {
		time = e.data
		var date = new Date();
		date.setTime(time);
		this.year_element.value   = date.getFullYear();
		this.month_element.value  = date.getMonth()+1;
		this.day_element.value    = date.getDate();
		this.hour_element.value   = date.getHours();
		this.minute_element.value = date.getMinutes();
		this.second_element.value = date.getSeconds()+date.getMilliseconds()/1000;
	},

	build_callback: function(event) {
		var timer = this.timer;
		var time_form = this;
		switch(event) {
			case 'submit':
				return function(e) {
					//console.log('WidgetBasicTimeForm.submit');
					e.preventDefault();


		var date = new Date();
		date.setFullYear(time_form.year_element.value);
		date.setMonth(time_form.month_element.value-1);
		date.setDate(time_form.day_element.value);
		date.setHours(time_form.hour_element.value);
		date.setMinutes(time_form.minute_element.value);
		date.setSeconds(time_form.second_element.value);

					timer.set(date.getTime());
					return false;
				};
			default:
				return function() {};
		}
	}

};



// last: UI/Widgets/TimeForm.js
/**
 * @summary Widget for visualising the current time as a number.
 * @class Widget for visualising the current time as a number.
 * @author Benoît Mathern
 * @constructor
 * @mixes Samotraces.UI.Widgets.Widget
 * @see Samotraces.UI.Widgets.ReadableTimeForm
 * @description
 * Samotraces.UI.Widgets.TimeForm is a generic
 * Widget to visualise the current time.
 *
 * The time is displayed as a number. See
 * {@link Samotraces.Widgets.TimeForm} to convert
 * raw time (in ms from the 01/01/1970) to a human readable
 * format.
 * 
 * This widget observes a Samotraces.Lib.Timer object.
 * When the timer changes the new time is displayed.
 * This widget also allow to change the time of the timer.
 * 
 * @param {String}	html_id
 *     Id of the DIV element where the widget will be
 *     instantiated
 * @param {Samotraces.Timer} timer
 *     Timer object to observe.
 */
Samotraces.UI.Widgets.TimeForm = function(html_id,timer) {
	// WidgetBasicTimeForm is a Widget
	Samotraces.UI.Widgets.Widget.call(this,html_id);

	this.timer = timer;
	this.timer.on('timer:update',this.refresh.bind(this));
	this.timer.on('timer:play:update',this.refresh.bind(this));

	this.init_DOM();
	this.refresh({data: this.timer.time});
};

Samotraces.UI.Widgets.TimeForm.prototype = {
	init_DOM: function() {

		var p_element = document.createElement('p');

		var text_node = document.createTextNode('Current time: ');
		p_element.appendChild(text_node);

		this.input_element = document.createElement('input');
		this.input_element.setAttribute('type','text');
		this.input_element.setAttribute('name','time');
		this.input_element.setAttribute('size',15);
		this.input_element.setAttribute('value',this.timer.time);
		p_element.appendChild(this.input_element);

		var submit_element = document.createElement('input');
		submit_element.setAttribute('type','submit');
		submit_element.setAttribute('value','Update time');
		p_element.appendChild(submit_element);

		this.form_element = document.createElement('form');
		this.form_element.addEventListener('submit', this.build_callback('submit'));

		this.form_element.appendChild(p_element);

		this.element.appendChild(this.form_element);
	},

	refresh: function(e) {
		this.input_element.value = e.data;
	},

	build_callback: function(event) {
		var timer = this.timer;
		var input_element = this.input_element;
		switch(event) {
			case 'submit':
				return function(e) {
					//console.log('WidgetBasicTimeForm.submit');
					e.preventDefault();
					timer.set(input_element.value);
					return false;
				};
			default:
				return function() {};
		}
	}

};


// last: UI/Widgets/TimePlayer.js
/**
 * @summary Widget for playing/pausing a timer and controlling videos.
 * @class Widget for playing/pausing a timer and controlling videos.
 * @author Benoît Mathern
 * @constructor
 * @mixes Samotraces.UI.Widgets.Widget
 * @description
 * Samotraces.UI.Widgets.TimePlayer is a Widget
 * that allow to trigger the "play/pause" mechanism
 * of a timer. In addition, it controls a set of videos
 * that are synchronised to this timer.
 * 
 * This widget observes a Samotraces.Timer object.
 * When the timer changes the videos are .
 * This widget also allow to change the time of the timer.
 * 
 * @param {String}	html_id
 *     Id of the DIV element where the widget will be
 *     instantiated
 * @param {Samotraces.Timer} timer
 *     Timer object to observe.
 * @param {Array.<Samotraces.UI.Widgets.TimePlayer.VideoConfig>} [videos]
 *     Array of VideoConfig, that defines the set of
 *     videos that will be synchronised on the timer.
 */
Samotraces.UI.Widgets.TimePlayer = function(html_id,timer,videos) {
	// WidgetBasicTimeForm is a Widget
	Samotraces.UI.Widgets.Widget.call(this,html_id);

	/**
	 * @typedef Samotraces.Widgets.TimePlayer.VideoConfig
	 * @property {string} id - Id of the HTML element
	 *     containing the video
	 * @property {string} [youtube] - Url of the youtube
	 *     video to display
	 * @property {string} [vimeo] - Url of the vimeo
	 *     video to display
	 */
	var video_ids = videos || [];

	this.videos = video_ids.map(function(v) {
		if(v.youtube) {
			return Popcorn.youtube('#'+v.id,v.youtube);
		} else if(v.vimeo) {
			return Popcorn.vimeo('#'+v.id,v.vimeo);
		} else {
			return Popcorn('#'+v.id);
		}
	});

	this.timer = timer;
	this.timer.on('timer:update',this.onUpdateTime.bind(this));
	this.timer.on('timer:play',this.onPlay.bind(this));
	this.timer.on('timer:pause',this.onPause.bind(this));


	this.init_DOM();
	this.onUpdateTime({data: this.timer.time});
};

Samotraces.UI.Widgets.TimePlayer.prototype = {
	init_DOM: function() {

		var p_element = document.createElement('p');

		this.play_button = document.createElement('img');
		this.play_button.setAttribute('src','images/control_play.png');

		p_element.appendChild(this.play_button);

		this.play_button.addEventListener('click',this.onClickPlayButton.bind(this));

		this.element.appendChild(p_element);
	},

	onUpdateTime: function(e) {
		this.videos.map(function(v) {
			v.currentTime(e.data);
		});
	},

	onClickPlayButton: function(e) {
		if(this.timer.is_playing) {
			this.timer.pause();
			this.play_button.setAttribute('src','images/control_play.png');
		} else {
			this.timer.play();
			this.play_button.setAttribute('src','images/control_pause.png');
		}
	},

	onPlay: function(e) {
		this.videos.map(function(v) {
			v.play(e.data);
		});
	},

	onPause: function(e) {
		this.videos.map(function(v) {
			v.pause(e.data);
		});
	},
};


// last: UI/Widgets/TimeSlider.js
/**
 * @summary Widget for visualising a time slider.
 * @class Widget for visualising a time slider.
 * @author Benoît Mathern
 * @constructor
 * @mixes Samotraces.UI.Widgets.Widget
 * @description
 * Samotraces.UI.Widgets.d3Basic.TimeSlider is a generic
 * Widget to visualise the current time in a temporal window
 *
 * @param {String}	divId
 *     Id of the DIV element where the widget will be
 *     instantiated
 * @param time_window
 *     TimeWindow object -> representing the wide window
 *     (e.g., the whole trace)
 * @param timer
 *     Timeer object -> containing the current time
 */
Samotraces.UI.Widgets.TimeSlider = function(html_id,time_window,timer) {
	// WidgetBasicTimeForm is a Widget
	Samotraces.UI.Widgets.Widget.call(this,html_id);

	this.add_class('Widget-TimeSlider');
	$(window).resize(this.draw.bind(this));

	this.timer = timer;
	this.timer.on('timer:update',this.draw.bind(this));
	this.timer.on('timer:play:update',this.refresh.bind(this));

	this.time_window = time_window;
	this.time_window.on('tw:update',this.draw.bind(this));

	// update slider style
	this.slider_offset = 0;

	this.init_DOM();
	// update slider's position
	this.draw();

};

Samotraces.UI.Widgets.TimeSlider.prototype = {
	init_DOM: function() {
		// create the slider
		this.slider_element = document.createElement('div');
		this.element.appendChild(this.slider_element);

		// hand made drag&drop
		var widget = this;
		this.add_behaviour('changeTimeOnDrag',this.slider_element,{
				onUpCallback: function(delta_x) {
					var new_time = widget.timer.time + delta_x*widget.time_window.get_width()/widget.element.clientWidth;
					widget.timer.set(new_time);
				},
				onMoveCallback: function(offset) {
					var offset = widget.slider_offset + offset;
					widget.slider_element.setAttribute('style','left: '+offset+'px;');
				},
			});
	},

	draw: function() {
		this.slider_offset = (this.timer.time - this.time_window.start)*this.element.clientWidth/this.time_window.get_width();
		this.slider_element.setAttribute('style','left:'+this.slider_offset+'px; display: block;');
	},

};



// last: UI/Widgets/TraceDisplayCurve.js
/**
 * @summary Widget for visualising a trace where obsels are displayed as images.
 * @class Widget for visualising a trace where obsels are displayed as images
 * @author Benoît Mathern
 * @requires d3.js framework (see <a href="http://d3js.org">d3js.org</a>)
 * @constructor
 * @mixes Samotraces.UI.Widgets.Widget
 * @description
 * DESCRIPTION TO COME...
 */
Samotraces.UI.Widgets.TraceDisplayCurve = function(divId,trace,time_window,options) {

	options = options || {};

	// WidgetBasicTimeForm is a Widget
	Samotraces.UI.Widgets.Widget.call(this,divId);

	this.add_class('Widget-TraceDisplayIcons');
	$(window).resize(this.refresh_x.bind(this));

	this.trace = trace;
	this.trace.on('trace:update',this.draw.bind(this));
	this.trace.on('trace:create_obsel',this.draw.bind(this));
	this.trace.on('trace:remove_obsel',this.draw.bind(this));
	this.trace.on('trace:edit_obsel',this.draw.bind(this));

	this.window = time_window;
	this.window.on('tw:update',this.refresh_x.bind(this));
	this.window.on('tw:translate',this.translate_x.bind(this));

//	this.obsel_selector = obsel_selector;
//	this.window.addEventListener('',this..bind(this));


	this.options = {};
	// create function that returns value or function
	var this_widget = this;
	var bind_function = function(val_or_fun) {
			if(val_or_fun instanceof Function) {
				return val_or_fun.bind(this_widget);
			} else {
				return val_or_fun;
			}
		};
	this.options.x = bind_function(options.x || function(o) {
			return this.calculate_x(o.get_begin());
		});
	this.options.y = bind_function(options.y || function(o) {
			return 100 - o.get_attribute('y');
		});
	this.options.width = bind_function(options.width || 16);
	this.options.height = bind_function(options.height || 16);
	this.options.url = bind_function(options.url || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAG7AAABuwBHnU4NQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAKsSURBVDiNrZNLaFNpFMd/33fvTa5tYpuq0yatFWugRhEXw9AuhJEZBCkiqJWCIErrxp241C6L6650M/WBowunoyCDCjKrGYZ0IbiwxkdUbGyaPmgSm8d9f25MbXUlzH95zv/8OOdwjlBKsVajU1kEtJiavNBsaKcBqq5/3fKDSwrKY33JdX7RAIxOZQGM3bHIymCyPZhZqT8p2d4sQGtY7+yObvhxMjsvp4uVKOA2QEIpxehUFl2IvuFUZ3rZcu/+9X7RWqg7Jxw/QAFhTdLRFJoY6N4SazONo1czs/2eUlNjfUn0Risne+Pp9yv18TvZwrl9iVb2J2JEQhoKKNke6UJ55LfMB4aSHeMne+Ppay/yAkBcTL9ma7Np7Yu3/n1lOjdQ8wLO793GzlgzFdcjYujoUpAt17j8LIfjB5zdvfXBv3OlX3NVy5SAOJVKhP94M29UXB8FFGoWE89nufTkHQ9nFlEKejZuoLe1iYrr8+fbee9UKhEGhB6SYrBoudPLtnsAQCnF768Kq1v2AxAC6l7AsuUCsGS5h4uWOx2SYlBqQoyUHW/O9gO+1i9dbfyciKGA/wol3pTrANh+QNnx5jQhRuQ3VZ+1Z1OUg92biZkG/+SL3Hu7gPfVzQBIX6mJlpAeD2vrWds3mth+wOtSlUczS1RdfzUX1iQtIT3uKzWhO4GajJnGnc2mcf+j4x1umJ4uVShUbRSwUHPWwdvCxuOYaRxwAjUpAXUjk7eP9bTrEUNbNf30Q5ThXV0c6WknGvoSjxgax3e0uzcyeRtQcqwvSa5qmaYuB4aSHeMNiEJgahJ9zWQRQ2Mo2TFu6nIgV7XMdZd48+Vc/3CqM30m1XX3wcxi8d3H2sitl3mUACkEyZam24e2bTHbTOPc1cxsf6Pu/3mmtfred/4ESQNKXG8VACoAAAAASUVORK5CYII=');

	this.init_DOM();
	this.data = this.trace.list_obsels();
	this.draw();
};

Samotraces.UI.Widgets.TraceDisplayCurve.prototype = {
	init_DOM: function() {


		var div_elmt = d3.select('#'+this.id);
		this.svg = div_elmt.append('svg');

		// create the (red) line representing current time
		if(typeof(this.window.timer) !== "undefined") {
			this.svg.append('line')
				.attr('x1','50%')
				.attr('y1','0%')
				.attr('x2','50%')
				.attr('y2','100%')
				.attr('stroke-width','1px')
				.attr('stroke','red')
				.attr('opacity','0.3');
		}

		this.scale_x = this.element.clientWidth/this.window.get_width();
		this.translate_offset = 0;

		this.svg_gp = this.svg.append('g')
						.attr('transform', 'translate(0,0)');
		this.svg_gp.append('path')
				.attr('fill','none')
				.attr('stroke','black')
				.attr('stroke-width','1px')
				.attr('d',"");

		// event listeners
		var widget = this;
		this.add_behaviour('changeTimeOnDrag',this.element,{
				onUpCallback: function(delta_x) {
					var time_delta = -delta_x*widget.window.get_width()/widget.element.clientWidth;
					widget.svg_gp.attr('transform','translate('+(-widget.translate_offset)+',0)');
					widget.window.translate(time_delta);
				},
				onMoveCallback: function(offset) {
					widget.svg_gp.attr('transform','translate('+(offset-widget.translate_offset)+',0)');
				},
			});
		this.add_behaviour('zommOnScroll',this.element,{timeWindow: this.window});
	},


	// TODO: needs to be named following a convention 
	// to be decided on
	calculate_x: function(time) {
		return x = (time - this.window.start)*this.scale_x + this.translate_offset;
	},
	translate_x: function(e) {
		var time_delta = e.data;
		this.translate_offset += time_delta*this.scale_x;
		this.svg_gp
			.attr('transform', 'translate('+(-this.translate_offset)+',0)');
	},

	refresh_x: function() {
		this.scale_x = this.element.clientWidth/this.window.get_width();
		this.translate_offset = 0;
		this.svg_gp
			.attr('transform', 'translate(0,0)');
		this.d3Obsels()
			.attr('d', d3.svg.line()
				.x(this.options.x)
				.y(this.options.y));
	},

	draw: function(e) {
		if(e) {
			switch(e.type) {
				case "trace:update":
					this.data = this.trace.list_obsels();
					break;
				default:
					this.data = this.trace.obsel_list; // do not want to trigger the refreshing of list_obsels()...
					break;
				}
		}

		this.d3Obsels()
			.attr('d', d3.svg.line()
				.x(this.options.x)
				.y(this.options.y));
	},


	d3Obsels: function() {
		return this.svg_gp
					.selectAll('path')
					// TODO: ATTENTION! WARNING! obsels MUST have a field id -> used as a key.
					//.data(this.data); //,function(d) { return d.id;});
					.data([this.data]); // TODO: bogue in case no ID exists -> might happen with KTBS traces and new obsels
	},


};







// last: UI/Widgets/TraceDisplayIcons.js
/**
 * @summary Widget for visualising a trace where obsels are displayed as images.
 * @class Widget for visualising a trace where obsels are displayed as images
 * @author Benoît Mathern
 * @requires d3.js framework (see <a href="http://d3js.org">d3js.org</a>)
 * @constructor
 * @mixes Samotraces.UI.Widgets.Widget
 * @description
 * The {@link Samotraces.UI.Widgets.TraceDisplayIcons|TraceDisplayIcons} widget
 * is a generic
 * Widget to visualise traces with images. This widget uses 
 * d3.js to display traces as images in a SVG image.
 * The default settings are set up to visualise 16x16 pixels
 * icons. If no url is defined (see options), a questionmark 
 * icon will be displayed by default for each obsel.
 *
 * Note that clicking on an obsel will trigger a 
 * {@link Samotraces.UI.Widgets.TraceDisplayIcons#ui:click:obsel|ui:click:obsel}
 * event.
 *
 * Tutorials {@tutorial tuto1.1_trace_visualisation},
 * {@tutorial tuto1.2_adding_widgets}, and 
 * {@tutorial tuto1.3_visualisation_personalisation} illustrates
 * in more details how to use this class.
 * @param {String}	divId
 *     Id of the DIV element where the widget will be
 *     instantiated
 * @param {Trace}	trace
 *     Trace object to display
 * @param {TimeWindow} time_window
 *     TimeWindow object that defines the time frame
 *     being currently displayed.
 *
 * @param {VisuConfig} [options]
 *     Object determining how to display the icons
 *     (Optional). All the options field can be either 
 *     a value or a function that will be called by 
 *     d3.js. The function will receive as the first
 *     argument the Obsel to display and should return 
 *     the calculated value.
 *     If a function is defined as an argument, it will
 *     be binded to the TraceDisplayIcons instance.
 *     This means that you can call any method of the 
 *     TraceDisplayIcons instance to help calculate 
 *     the x position or y position of an icon. This 
 *     makes it easy to define various types of behaviours.
 *     Relevant methods to use are:
 *     link Samotraces.UI.Widgets.TraceDisplayIcons.calculate_x}
 *     See tutorial 
 *     {@tutorial tuto1.3_visualisation_personalisation}
 *     for more details and examples.
 *
 * @example
 * var options = {
 *     y: 20,
 *     width: 32,
 *     height: 32,
 *     url: function(obsel) {
 *         switch(obsel.type) {
 *             case 'click':
 *                 return 'images/click.png';
 *             case 'focus':
 *                 return 'images/focus.png';
 *             default:
 *                 return 'images/default.png';
 *         }
 *     }
 * };
 */
Samotraces.UI.Widgets.TraceDisplayIcons = function(divId,trace,time_window,options) {

	options = options || {};

	// WidgetBasicTimeForm is a Widget
	Samotraces.UI.Widgets.Widget.call(this,divId);

	this.add_class('Widget-TraceDisplayIcons');
	$(window).resize(this.refresh_x.bind(this));

	this.trace = trace;
	this.trace.on('trace:update',this.draw.bind(this));
	this.trace.on('trace:create_obsel',this.draw.bind(this));
	this.trace.on('trace:remove_obsel',this.draw.bind(this));
	this.trace.on('trace:edit_obsel',this.obsel_redraw.bind(this));

	this.window = time_window;
	this.window.on('tw:update',this.refresh_x.bind(this));
	this.window.on('tw:translate',this.translate_x.bind(this));

//	this.obsel_selector = obsel_selector;
//	this.window.addEventListener('',this..bind(this));

	this.init_DOM();
	this.data = this.trace.list_obsels();

	this.options = {};
	/**
	 * VisuConfig is a shortname for the 
	 * {@link Samotraces.UI.Widgets.TraceDisplayIcons.VisuConfig}
	 * object.
	 * @typedef VisuConfig
	 * @see Samotraces.UI.Widgets.TraceDisplayIcons.VisuConfig
	 */
	/**
	 * @typedef Samotraces.UI.Widgets.TraceDisplayIcons.VisuConfig
	 * @property {(number|function)}	[x]		
	 *     X coordinates of the top-left corner of the 
	 *     image (default: <code>function(o) {
	 *         return this.calculate_x(o.timestamp) - 8;
	 *     })</code>)
	 * @property {(number|function)}	[y=17]
	 *     Y coordinates of the top-left corner of the 
	 *     image
	 * @property {(number|function)}	[width=16]
	 *     Width of the image
	 * @property {(number|function)}	[height=16]
	 *     Height of the image
	 * @property {(string|function)}	[url=a questionmark dataurl string]
	 *     Url of the image to display
	 * @description
	 * Object determining how to display the icons
	 * (Optional). All the options field can be either 
	 * a value or a function that will be called by 
	 * d3.js. The function will receive as the first
	 * argument the Obsel to display and should return 
	 * the calculated value.
	 * If a function is defined as an argument, it will
	 * be binded to the TraceDisplayIcons instance.
	 * This means that you can call any method of the 
	 * TraceDisplayIcons instance to help calculate 
	 * the x position or y position of an icon. This 
	 * makes it easy to define various types of behaviours.
	 * Relevant methods to use are:
	 * link Samotraces.UI.Widgets.TraceDisplayIcons.calculate_x}
	 * See tutorial 
	 * {@tutorial tuto1.3_visualisation_personalisation}
	 * for more details and examples.
	 */
	// create function that returns value or function
	var this_widget = this;
	var bind_function = function(val_or_fun) {
			if(val_or_fun instanceof Function) {
				return val_or_fun.bind(this_widget);
			} else {
				return val_or_fun;
			}
		};
	this.options.x = bind_function(options.x || function(o) {
			return this.calculate_x(o.get_begin()) - 8;
		});
	this.options.y = bind_function(options.y || 17);
	this.options.width = bind_function(options.width || 16);
	this.options.height = bind_function(options.height || 16);
	this.options.url = bind_function(options.url || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAG7AAABuwBHnU4NQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAKsSURBVDiNrZNLaFNpFMd/33fvTa5tYpuq0yatFWugRhEXw9AuhJEZBCkiqJWCIErrxp241C6L6650M/WBowunoyCDCjKrGYZ0IbiwxkdUbGyaPmgSm8d9f25MbXUlzH95zv/8OOdwjlBKsVajU1kEtJiavNBsaKcBqq5/3fKDSwrKY33JdX7RAIxOZQGM3bHIymCyPZhZqT8p2d4sQGtY7+yObvhxMjsvp4uVKOA2QEIpxehUFl2IvuFUZ3rZcu/+9X7RWqg7Jxw/QAFhTdLRFJoY6N4SazONo1czs/2eUlNjfUn0Risne+Pp9yv18TvZwrl9iVb2J2JEQhoKKNke6UJ55LfMB4aSHeMne+Ppay/yAkBcTL9ma7Np7Yu3/n1lOjdQ8wLO793GzlgzFdcjYujoUpAt17j8LIfjB5zdvfXBv3OlX3NVy5SAOJVKhP94M29UXB8FFGoWE89nufTkHQ9nFlEKejZuoLe1iYrr8+fbee9UKhEGhB6SYrBoudPLtnsAQCnF768Kq1v2AxAC6l7AsuUCsGS5h4uWOx2SYlBqQoyUHW/O9gO+1i9dbfyciKGA/wol3pTrANh+QNnx5jQhRuQ3VZ+1Z1OUg92biZkG/+SL3Hu7gPfVzQBIX6mJlpAeD2vrWds3mth+wOtSlUczS1RdfzUX1iQtIT3uKzWhO4GajJnGnc2mcf+j4x1umJ4uVShUbRSwUHPWwdvCxuOYaRxwAjUpAXUjk7eP9bTrEUNbNf30Q5ThXV0c6WknGvoSjxgax3e0uzcyeRtQcqwvSa5qmaYuB4aSHeMNiEJgahJ9zWQRQ2Mo2TFu6nIgV7XMdZd48+Vc/3CqM30m1XX3wcxi8d3H2sitl3mUACkEyZam24e2bTHbTOPc1cxsf6Pu/3mmtfred/4ESQNKXG8VACoAAAAASUVORK5CYII=');

	this.draw();
};

Samotraces.UI.Widgets.TraceDisplayIcons.prototype = {
	init_DOM: function() {


		var div_elmt = d3.select('#'+this.id);
		this.svg = div_elmt.append('svg');

		// create the (red) line representing current time
		if(typeof(this.window.timer) !== "undefined") {
			this.svg.append('line')
				.attr('x1','50%')
				.attr('y1','0%')
				.attr('x2','50%')
				.attr('y2','100%')
				.attr('stroke-width','1px')
				.attr('stroke','red')
				.attr('opacity','0.3');
		}

		this.scale_x = this.element.clientWidth/this.window.get_width();
		this.translate_offset = 0;

		this.svg_gp = this.svg.append('g')
						.attr('transform', 'translate(0,0)');
		this.svg_selected_obsel = this.svg.append('line')
			.attr('x1','0')
			.attr('y1','0%')
			.attr('x2','0')
			.attr('y2','100%')
			.attr('stroke-width','1px')
			.attr('stroke','black')
			.attr('opacity','0.3')
			.attr('transform', 'translate(0,0)')
			.style('display','none');

		// event listeners
		var widget = this;
		this.add_behaviour('changeTimeOnDrag',this.element,{
				onUpCallback: function(delta_x) {
					var time_delta = -delta_x*widget.window.get_width()/widget.element.clientWidth;
					widget.svg_gp.attr('transform','translate('+(-widget.translate_offset)+',0)');
					widget.window.translate(time_delta);
				},
				onMoveCallback: function(offset) {
					widget.svg_gp.attr('transform','translate('+(offset-widget.translate_offset)+',0)');
				},
			});
		this.add_behaviour('zommOnScroll',this.element,{timeWindow: this.window});
	},


	// TODO: needs to be named following a convention 
	// to be decided on
	/**
	 * Calculates the X position in pixels corresponding to 
	 * the time given in parameter.
	 * @param {Number} time Time for which to seek the corresponding x parameter
	 */
	calculate_x: function(time) {
		return x = (time - this.window.start)*this.scale_x + this.translate_offset;
	},
	translate_x: function(e) {
		var time_delta = e.data;
		this.translate_offset += time_delta*this.scale_x;
		this.svg_gp
			.attr('transform', 'translate('+(-this.translate_offset)+',0)');
	},

	refresh_x: function() {
		this.scale_x = this.element.clientWidth/this.window.get_width();
		this.translate_offset = 0;
		this.svg_gp
			.attr('transform', 'translate(0,0)');
		this.d3Obsels()
			.attr('x',this.options.x)
			.attr('y',this.options.y);
	},

	draw: function(e) {
		if(e) {
			switch(e.type) {
				case "trace:update":
					this.data = this.trace.list_obsels();
					break;
				default:
					this.data = this.trace.obsel_list; // do not want to trigger the refreshing of list_obsels()...
					break;
				}
		}

		this.d3Obsels()
			.exit()
			.remove();
		this.d3Obsels()
			.enter()
			.append('image')
			.attr('class','Samotraces-obsel')
			.attr('x',this.options.x)
			.attr('y',this.options.y)
			.attr('width',this.options.width)
			.attr('height',this.options.height)
			.attr('xlink:href',this.options.url);
		// Storing obsel data with jQuery for accessibility from 
		// events defined by users with jQuery
		$('image',this.element).each(function(i,el) {
			$.data(el,{
				'Samotraces-type': 'obsel',
				'Samotraces-data': d3.select(el).datum()
			});
		});
	},

	obsel_redraw: function(e) {
		obs = e.data;
		var sel = this.d3Obsels()
			.filter(function(o) {
//				console.log('data:id,obsel_edit_id',id,obs.get_id(),id == obs.get_id());
				return o.get_id() == obs.get_id();
			})
			.datum(obs)
			.attr('x',this.options.x)
			.attr('y',this.options.y)
			.attr('width',this.options.width)
			.attr('height',this.options.height)
			.attr('xlink:href',this.options.url);
	},

	d3Obsels: function() {
		return this.svg_gp
					.selectAll('circle,image,rect')
					// TODO: ATTENTION! WARNING! obsels MUST have a field id -> used as a key.
					//.data(this.data); //,function(d) { return d.id;});
					.data(this.data, function(d) { return d.id;}); // TODO: bogue in case no ID exists -> might happen with KTBS traces and new obsels
	},


};







// last: UI/Widgets/TraceDisplayObselOccurrences.js
/**
 * @summary Widget for visualising a trace.
 * @class Widget for visualising a trace.
 * @author Benoît Mathern
 * @requires d3.js framework (see <a href="http://d3js.org">d3js.org</a>)
 * @constructor
 * @mixes Samotraces.UI.Widgets.Widget
 * @description
 * DESCRIPTION TO COME....
 * @param {String}	divId
 *     Id of the DIV element where the widget will be
 *     instantiated
 * @param {Samotraces.Trace}	trace
 *     Trace object to display
 * @param {Samotraces.TimeWindow} time_window
 *     TimeWindow object that defines the time frame
 *     being currently displayed.
 * @todo add description and update doc...
 */
Samotraces.UI.Widgets.TraceDisplayObselOccurrences = function(divId,trace,time_window) {
	// WidgetBasicTimeForm is a Widget
	Samotraces.UI.Widgets.Widget.call(this,divId);

	this.add_class('Widget-ObselOccurrences');
	//this.add_class('Widget-TraceDisplayObselOccurrences');
	$(window).resize(this.refresh_x.bind(this));

	this.trace = trace;
	this.trace.on('trace:update',this.draw.bind(this));
	this.trace.on('trace:create_obsel',this.draw.bind(this));
	this.trace.on('trace:remove_obsel',this.draw.bind(this));
	this.trace.on('trace:edit_obsel',this.obsel_redraw.bind(this));

	this.window = time_window;
	this.window.on('tw:update',this.refresh_x.bind(this));
	this.window.on('tw:translate',this.translate_x.bind(this));

//	this.obsel_selector = obsel_selector;
//	this.window.addEventListener('',this..bind(this));

	this.init_DOM();
	this.data = this.trace.list_obsels();

	// create function that returns value or function
	var this_widget = this;

	this.draw();
};

Samotraces.UI.Widgets.TraceDisplayObselOccurrences.prototype = {
	init_DOM: function() {


		var div_elmt = d3.select('#'+this.id);
		this.svg = div_elmt.append('svg')
				.attr("xmlns","http://www.w3.org/2000/svg")
				.attr("version","1.1");


		this.scale_x = this.element.clientWidth/this.window.get_width();
		this.translate_offset = 0;

		this.svg_gp = this.svg.append('g')
						.attr('transform', 'translate(0,0)');

		// event listeners
		var widget = this;
		this.add_behaviour('changeTimeOnDrag',this.element,{
				onUpCallback: function(delta_x) {
					var time_delta = -delta_x*widget.window.get_width()/widget.element.clientWidth;
					widget.svg_gp.attr('transform','translate('+(-widget.translate_offset)+',0)');
					widget.window.translate(time_delta);
				},
				onMoveCallback: function(offset) {
					widget.svg_gp.attr('transform','translate('+(offset-widget.translate_offset)+',0)');
				},
			});
		this.add_behaviour('zommOnScroll',this.element,{timeWindow: this.window});
	},


	// TODO: needs to be named following a convention 
	// to be decided on
	/**
	 * Calculates the X position in pixels corresponding to 
	 * the time given in parameter.
	 * @param {Number} time Time for which to seek the corresponding x parameter
	 */
	calculate_x: function(o) {
		return x = (o.get_begin() - this.window.start)*this.scale_x + this.translate_offset;
	},
	calculate_width: function(o) {
		return x = Math.max(0.01, (o.get_end() - o.get_begin())*this.scale_x ); // width of 0 => not displayed
	},
	translate_x: function(e) {
		var time_delta = e.data;
		this.translate_offset += time_delta*this.scale_x;
		this.svg_gp
			.attr('transform', 'translate('+(-this.translate_offset)+',0)');
	},

	refresh_x: function() {
		this.scale_x = this.element.clientWidth/this.window.get_width();
		this.translate_offset = 0;
		this.svg_gp
			.attr('transform', 'translate(0,0)');
		this.d3Obsels()
			.attr('x',this.calculate_x.bind(this))
			.attr('width',this.calculate_width.bind(this))
	},

	draw: function(e) {
		if(e) {
			switch(e.type) {
				case "trace:update":
					this.data = this.trace.list_obsels();
					break;
				default:
					this.data = this.trace.obsel_list; // do not want to trigger the refreshing of list_obsels()...
					break;
				}
		}

		this.d3Obsels()
			.exit()
			.remove();
		this.d3Obsels()
			.enter()
			.append('rect')
			//.attr('class','Samotraces-obsel')
			.attr('x',this.calculate_x.bind(this))
			.attr('y','0')
			.attr('width',this.calculate_width.bind(this))
			.attr('height','20');
			//.attr('stroke-width','1px')
			//.attr('stroke','black');
		// Storing obsel data with jQuery for accessibility from 
		// events defined by users with jQuery
		$('rect',this.element).each(function(i,el) {
			$.data(el,{
				'Samotraces-type': 'obsel',
				'Samotraces-data': d3.select(el).datum()
			});
		});
	},

	obsel_redraw: function(e) {
		obs = e.data;
		var sel = this.d3Obsels()
			.filter(function(o) {
//				console.log('data:id,obsel_edit_id',id,obs.get_id(),id == obs.get_id());
				return o.get_id() == obs.get_id();
			})
			.datum(obs)
			.attr('x',this.calculate_x.bind(this))
			.attr('width',this.calculate_width.bind(this))
			.attr('xlink:href',this.options.url);
	},

	d3Obsels: function() {
		return this.svg_gp
					.selectAll('circle,image,rect')
					// TODO: ATTENTION! WARNING! obsels MUST have a field id -> used as a key.
					//.data(this.data); //,function(d) { return d.id;});
					.data(this.data, function(d) { return d.id;}); // TODO: bogue in case no ID exists -> might happen with KTBS traces and new obsels
	},


};








// last: UI/Widgets/TraceDisplayZoomContext.js
/**
 * @summary Widget for visualising a trace.
 * @class Widget for visualising a trace.
 * @author Benoît Mathern
 * @requires d3.js framework (see <a href="http://d3js.org">d3js.org</a>)
 * @constructor
 * @mixes Samotraces.UI.Widgets.Widget
 * @description
 * DESCRIPTION TO COME....
 * @param {String}	divId
 *     Id of the DIV element where the widget will be
 *     instantiated
 * @param {Samotraces.Trace}	trace
 *     Trace object to display
 * @param {Samotraces.TimeWindow} time_window
 *     TimeWindow object that defines the time frame
 *     being currently displayed.
 * @todo add description and update doc...
 */
Samotraces.UI.Widgets.TraceDisplayZoomContext = function(divId,trace,time_window1,time_window2,options1,options2) {
	// WidgetBasicTimeForm is a Widget
	Samotraces.UI.Widgets.Widget.call(this,divId);

	this.mode = 'window_sync';
	if(options1 !== undefined || options2 !== undefined) {
		this.mode = 'obsel_sync';
		if(options1 !== undefined && options1.hasOwnProperty('x')) {
			this.x1 = options1.x.bind(this);	
		}
		if(options2 !== undefined && options2.hasOwnProperty('x')) {
			this.x2 = options2.x.bind(this);
		}
	}

	this.add_class('Widget-ObselOccurrences');
	//this.add_class('Widget-TraceDisplayObselOccurrences');
	$(window).resize(this.refresh_x.bind(this));

	this.trace = trace;
	this.trace.on('trace:update',this.draw.bind(this));
	this.trace.on('trace:create_obsel',this.draw.bind(this));
	this.trace.on('trace:remove_obsel',this.draw.bind(this));
	this.trace.on('trace:edit_obsel',this.obsel_redraw.bind(this));

	this.window1 = time_window1;
	this.window1.on('tw:update',this.refresh_x.bind(this));
	this.window1.on('tw:translate',this.refresh_x.bind(this));

	this.window2 = time_window2;
	this.window2.on('tw:update',this.refresh_x.bind(this));
	this.window2.on('tw:translate',this.refresh_x.bind(this));

//	this.obsel_selector = obsel_selector;
//	this.window1.addEventListener('',this..bind(this));

	this.init_DOM();
	this.data = this.trace.list_obsels();

	// create function that returns value or function
	var this_widget = this;

	this.draw();
};

Samotraces.UI.Widgets.TraceDisplayZoomContext.prototype = {
	init_DOM: function() {


		var div_elmt = d3.select('#'+this.id);
		this.svg = div_elmt.append('svg')
				.attr("xmlns","http://www.w3.org/2000/svg")
				.attr("version","1.1");


		this.scale_x1 = this.element.clientWidth/this.window1.get_width();
		this.scale_x2 = this.element.clientWidth/this.window2.get_width();
		this.translate_offset = 0;

		this.sync_path = this.svg.append('path')
					.attr('style','stroke:grey;stroke-width:1px;fill:#ddd;');
		this.svg_gp = this.svg.append('g')
						.attr('transform', 'translate(0,0)');

	},


	// TODO: needs to be named following a convention 
	// to be decided on
	/**
	 * Calculates the X position in pixels corresponding to 
	 * the time given in parameter.
	 * @param {Number} time Time for which to seek the corresponding x parameter
	 */
	calculate_x: function(t) {
		return x = (t - this.w_start)*this.scale_x;
	},
	o2x1: function(o) {
		this.w_start = this.window1.start;
		this.scale_x = this.scale_x1;
		return this.x1(o);
	},
	o2x2: function(o) {
		this.w_start = this.window2.start;
		this.scale_x = this.scale_x2;
		return this.x2(o);
	},
	x1: function(o) {
		return this.calculate_x(o.get_begin());
	},
	x2: function(o) {
		return this.calculate_x(o.get_begin());
	},
	calculate_path: function(o) {
		var p = [];
		var x1 = this.o2x1(o);
		var x2 = this.o2x2(o);
		p = ['M',x1,'0','C',x1,'10,',x2,'10,',x2,'20'];
		return p.join(' ');
	},
	calculate_visibility: function(o) {
		var x1 = this.o2x1(o);
		if(x1 < 0) return false;
		if(x1 > this.element.clientWidth) return false;
		var x2 = this.o2x2(o);
		if(x2 > this.element.clientWidth) return false;
		if(x2 < 0) return false;
		return true;
	},
	calculate_style: function(o) {
		if(this.calculate_visibility(o)) {
		//if(true) {
			return 'stroke:grey;stroke-width:1px;fill:none;';
		} else {
			return 'stroke:none;stroke-width:1px;fill:none;';
		}
	},
	translate_x: function(e) {
		var time_delta = e.data;
		this.translate_offset += time_delta*this.scale_x;
		this.svg_gp
			.attr('transform', 'translate('+(-this.translate_offset)+',0)');
	},

	refresh_x: function() {
		this.scale_x1 = this.element.clientWidth/this.window1.get_width();
		this.scale_x2 = this.element.clientWidth/this.window2.get_width();
		this.translate_offset = 0;
		this.svg_gp
			.attr('transform', 'translate(0,0)');
		if(this.mode == "obsel_sync") {
			this.d3Obsels()
				.attr('d',this.calculate_path.bind(this))
				.attr('style',this.calculate_style.bind(this));
		} else {
			this.sync_path.attr('d',this.calculate_sync_path.bind(this));
		}
	},

	draw: function(e) {
		if(e) {
			switch(e.type) {
				case "trace:update":
					this.data = this.trace.list_obsels();
					break;
				default:
					this.data = this.trace.obsel_list; // do not want to trigger the refreshing of list_obsels()...
					break;
				}
		}
		if(this.mode == "obsel_sync") {
			this.d3Obsels()
				.exit()
				.remove();
			this.d3Obsels()
				.enter()
				.append('path')
				//.attr('class','Samotraces-obsel')
				.attr('d',this.calculate_path.bind(this))
				.attr('style',this.calculate_style.bind(this));
			this.d3Obsels()
				//.attr('stroke-width','1px')
				//.attr('stroke','black');
			// Storing obsel data with jQuery for accessibility from 
			// events defined by users with jQuery
			$('path',this.element).each(function(i,el) {
				$.data(el,{
					'Samotraces-type': 'obsel',
					'Samotraces-data': d3.select(el).datum()
				});
			});
		} else {
			this.sync_path.attr('d',this.calculate_sync_path.bind(this));
		}
	},
	calculate_sync_path: function() {
		var ts = Math.max(this.window1.start,this.window2.start);
		var te = Math.min(this.window1.end,this.window2.end);
		var x1s = (Math.min(ts,this.window1.end) - this.window1.start)*this.scale_x1;
		var x2s = (Math.min(ts,this.window2.end) - this.window2.start)*this.scale_x2;
		var x1e = (Math.max(te,this.window1.start) - this.window1.start)*this.scale_x1;
		var x2e = (Math.max(te,this.window2.start) - this.window2.start)*this.scale_x2;
		var p = ["M",x1s,"0","C",x1s,"20,",x2s,"0,",x2s,"20","L",x2e,"20","C",x2e,"0,",x1e,"20,",x1e,"0","Z"];
		return p.join(" ");
	},
	obsel_redraw: function(e) {
		obs = e.data;
		var sel = this.d3Obsels()
			.filter(function(o) {
//				console.log('data:id,obsel_edit_id',id,obs.get_id(),id == obs.get_id());
				return o.get_id() == obs.get_id();
			})
			.datum(obs)
			.attr('d',this.calculate_path.bind(this))
	},

	d3Obsels: function() {
		return this.svg_gp
					.selectAll('path')
					// TODO: ATTENTION! WARNING! obsels MUST have a field id -> used as a key.
					//.data(this.data); //,function(d) { return d.id;});
					.data(this.data, function(d) { return d.id;}); // TODO: bogue in case no ID exists -> might happen with KTBS traces and new obsels
	},


};








// last: UI/Widgets/Widget.js
/**
 * @mixin
 * @requires jQuery framework (see <a href="http://jquery.com">jquery.com</a>)
 * @requires jQuery Mouse Wheel plugin (see <a href="https://github.com/brandonaaron/jquery-mousewheel">Mouse Wheel plugin</a>)
 * @description
 * All widgets should inherit from this Samotraces.UI.Widgets.Widget.
 * 
 * In order to use create a widget that inherits from the 
 * Widget class, one mush include the following code in 
 * the constructor of their widget.
 * <code>
 * </code>
 *
 * @property {string} id Id of the HTML element the
 * Widget is attached to.
 * @property {HTMLElement} element HTML element the
 * Widget is attached to.
 */
Samotraces.UI.Widgets.Widget = (function() {
	/**
	 * Adds the given class to the HTML element to which
	 * this Widget is attached to.
	 * @memberof Samotraces.Widgets.Widget.prototype
	 * @public
	 * @method
	 * @param {string} class_name Name of the class to add
	 */
	function add_class(class_name) {
		this.element.className += ' '+class_name;
	}

	function unload() {
		this.element.className = '';
//		this.element.
	}
	/**
	 * Creates a new behaviour (interaction possibility)
	 * with the widget.
	 * Two behaviours are implemented so far:
	 * 1. 'changeTimeOnDrag'
	 * 2. 'zommOnScroll'
	 *
	 * 1. 'changeTimeOnDrag' behaviour allows to change
	 * a {@link Samotraces.Lib.Timer} on a drag-n-drop like event
	 * (JavaScript 'mousedown', 'mousemove', 'mouseup' and 'mouseleave'
	 * events). This allows to change the current time by dragging
	 * a trace visualisation or a slider for instance.
	 *
	 * 2. 'changeTimeOnDrag' behaviour allows to change
	 * a {@link Samotraces.Lib.TimeWindow} on a mouse scroll event
	 * (JavaScript 'wheel' event)
	 *
	 * @memberof Samotraces.Widgets.Widget.prototype
	 * @public
	 * @method
	 * @param {String} behaviourName Name of the behaviour
	 *     ('changeTimeOnDrag' or 'zommOnScroll'). See description above.
	 * @param {HTMLElement} eventTargetElement HTML Element on which
	 *     an eventListener will be created (typically, the element you
	 *     want to interact with).
	 * @param {Object} opt Options that vary depending on the
	 *     selected behaviour.
	 * @param {Function} opt.onUpCallback
	 *    (for 'changeTimeOnDrag' behaviour only)
	 *    Callback that will be called when the 'mouseup' event will be
	 *    triggered. The argument delta_x is passed to the callback
	 *    and represents the offset of the x axis in pixels between the
	 *    moment the mousedown event has been triggered and the moment
	 *    the current mouseup event has been triggered.
	 * @param {Function} opt.onMoveCallback
	 *    (for 'changeTimeOnDrag' behaviour only)
	 *    Callback that will be called when the 'mousemove' event will be
	 *    triggered. The argument delta_x is passed to the callback
	 *    and represents the offset of the x axis in pixels between the
	 *    moment the mousedown event has been triggered and the moment
	 *    the current mousemove event has been triggered.
	 * @param {Samotraces.Lib.TimeWindow} opt.timeWindow
	 *    (for 'zommOnScroll' behaviour only)
	 *    {@link Samotraces.Lib.TimeWindow} object that will
	 *    be edited when the zoom action is produced.
	 */
	function add_behaviour(behaviourName,eventTargetElement,opt) {

		switch(behaviourName) {
			case 'changeTimeOnDrag':
				var mousedown,mouseup,mousemove;
				var init_client_x;
				mousedown = function(e) {
				//	console.log('mousedown');
					init_client_x = e.clientX;
					eventTargetElement.addEventListener('mousemove',mousemove);
					eventTargetElement.addEventListener('mouseup',mouseup);
					eventTargetElement.addEventListener('mouseleave',mouseup);
					return false;
				};
				mouseup = function(e) {
				//	console.log('mouseup');
					if(init_client_x !== undefined) {
						var delta_x = (e.clientX - init_client_x);
						opt.onUpCallback(delta_x);
						eventTargetElement.removeEventListener('mousemove',mousemove);
						eventTargetElement.removeEventListener('mouseup',mouseup);
						eventTargetElement.removeEventListener('mouseleave',mouseup);
					}
					return false;
				};
				mousemove = function(e) {
					var delta_x = (e.clientX - init_client_x);
					opt.onMoveCallback(delta_x);
					return false;
				};
				eventTargetElement.addEventListener('mousedown',mousedown);
				break;	
			case 'zommOnScroll':
				wheel = function(e) {
					var coef = Math.pow(0.8,e.deltaY);
					opt.timeWindow.zoom(coef);
	//				opt.onWheelCallback.call(opt.bind,coef);
					e.preventDefault();
					return false;
				};
				$(eventTargetElement).mousewheel(wheel);
				break;
			default:
				break;
		}
	}
	return function(id) {
		// DOCUMENTED ABOVE
		this.id = id;
		this.element = document.getElementById(this.id);
		this.add_class = add_class;
		this.add_behaviour = add_behaviour;

		// call method
		this.add_class('Widget');
		return this;
	};
})();


// last: UI/Widgets/WindowScale.js
/**
 * @summary Widget for visualising a time scale.
 * @class Widget for visualising a time scale.
 * @author Benoît Mathern
 * @requires d3.js framework (see <a href="http://d3js.org">d3js.org</a>)
 * @constructor
 * @mixes Samotraces.UI.Widgets.Widget
 * @description
 * Samotraces.UI.Widgets.WindowScale is a generic
 * Widget to visualise the temporal scale of a 
 * {@link Samotraces.TimeWindow|TimeWindow}. This
 * widget uses d3.js to calculate and display the scale.
 *
 * Note: unless the optional argument is_javascript_date is defined,
 * the widget will try to guess if time is displayed as numbers,
 * or if time is displayed in year/month/day/hours/etc.
 * This second option assumes that the time is represented in
 * milliseconds since 1 January 1970 UTC.
 * @param {String}	divId
 *     Id of the DIV element where the widget will be
 *     instantiated
 * @param {} time_window
 *     TimeWindowCenteredOnTime object
 * @param {Boolean} [is_javascript_date]
 *     Boolean that describes if the scale represents a JavaScript Date object.
 *     If set to true, the widget will display years, months, days, hours, minutes...
 *     as if the time given was the number of milliseconds ellapsed since 1 January 1970 UTC.
 *     If set to false, the widget will display the numbers without attempting
 *     any conversion.
 *     This argument is optional. If not set, the widget will try to guess:
 *     If the number of the start of the given TimeWindow is above a billion, then
 *     it is assumed that the JavaScript Date object has been used to represent time.
 *     Otherwise, the numerical value of time will be displayed.
 */
Samotraces.UI.Widgets.WindowScale = function(html_id,time_window,is_javascript_date) {
	// WidgetBasicTimeForm is a Widget
	Samotraces.UI.Widgets.Widget.call(this,html_id);

	this.add_class('Widget-WindowScale');
	$(window).resize(this.draw.bind(this));

	this.window = time_window;
//	time_window.addObserver(this);
	this.window.on('tw:update',this.draw.bind(this));
	this.window.on('tw:translate',this.draw.bind(this));

	// trying to guess if time_window is related to a Date() object
	if(this.window.start > 1000000000) { // 1o^9 > 11 Jan 1970 if a Date object
		this.is_javascript_date = is_javascript_date || true;
	} else {
		this.is_javascript_date = is_javascript_date || false;
	}

	this.init_DOM();
	// update slider's position
	this.draw();

};

Samotraces.UI.Widgets.WindowScale.prototype = {
	init_DOM: function() {
		// create the slider
		this.svg = d3.select("#"+this.id).append("svg");
		if(this.is_javascript_date) {
			this.x = d3.time.scale(); //.range([0,this.element.getSize().x]);
		} else {
			this.x = d3.scale.linear();
		}
		this.xAxis = d3.svg.axis().scale(this.x); //.orient("bottom");
		this.x.domain([this.window.start,this.window.end]);
		this.svgAxis = this.svg
			.append("g");

/*		var widget = this;
		Samotraces.Lib.addBehaviour('changeTimeOnDrag',this.element,{
				onUpCallback: function(delta_x) {
					var time_delta = -delta_x*widget.time_window.get_width()/widget.element.clientWidth;
					widget.time_window.translate(time_delta);					
				},
				onMoveCallback: function(offset) {
				},
			});*/
		this.add_behaviour('zommOnScroll',this.element,{timeWindow: this.window});
	},

	draw: function() {
//console.log("redraw");
		this.x.range([0,this.element.clientWidth]);// = d3.time.scale().range([0,this.element.getSize().x]);
		this.x.domain([this.window.start,this.window.end]);
		this.svgAxis.call(this.xAxis);
	},
};



// last: UI/Widgets/WindowSlider.js
/**
 * @summary Widget for visualising a window slider.
 * @class Widget for visualising a window slider.
 * @author Benoît Mathern
 * @constructor
 * @mixes Samotraces.UI.Widgets.Widget
 * @description
 * Samotraces.UI.Widgets.d3Basic.WindowSlider is a generic
 * Widget to visualise a temporal window
 *
 * @param {String}	divId
 *     Id of the DIV element where the widget will be
 *     instantiated
 * @param wide_window
 *     TimeWindow object -> representing the wide window
 *     (e.g., the whole trace)
 * @param slider_window
 *     TimeWindow object -> representing the small window
 *     (e.g., the current time window being visualised with another widget)
 */
Samotraces.UI.Widgets.WindowSlider = function(html_id,wide_window,slider_window) {
	// WidgetBasicTimeForm is a Widget
	Samotraces.Widgets.Widget.call(this,html_id);

	this.add_class('Widget-WindowSlider');
	$(window).resize(this.draw.bind(this));

	this.wide_window = wide_window;
	this.wide_window.on('tw:update',this.draw.bind(this));
	this.wide_window.on('tw:translate',this.draw.bind(this));
	this.slider_window = slider_window;
	this.slider_window.on('tw:update',this.draw.bind(this));
	this.slider_window.on('tw:translate',this.draw.bind(this));

	this.slider_offset = 0;
	this.width = 0;

	this.init_DOM();
	// update slider's position
	this.draw();
};

Samotraces.UI.Widgets.WindowSlider.prototype = {
	init_DOM: function() {

		// create the slider
		this.slider_element = document.createElement('div');
		this.element.appendChild(this.slider_element);

		// hand made drag&drop
		// event listeners
		var widget = this;
		this.add_behaviour('changeTimeOnDrag',this.slider_element,{
				onUpCallback: function(delta_x) {
					var time_delta = delta_x*widget.wide_window.get_width()/widget.element.clientWidth;
					widget.slider_window.translate(time_delta);	
				},
				onMoveCallback: function(offset) {
					widget.slider_element.style.left = widget.slider_offset+offset+'px';
				},
			});
		this.add_behaviour('zommOnScroll',this.element,{timeWindow: this.slider_window});
	},

	draw: function() {
		this.width = this.slider_window.get_width()/this.wide_window.get_width()*this.element.clientWidth;
		this.slider_offset = (this.slider_window.start - this.wide_window.start)*this.element.clientWidth/this.wide_window.get_width();
		this.slider_element.style.display = 'block';
		this.slider_element.style.width = this.width+'px';
		this.slider_element.style.left = this.slider_offset+'px';
	},


};



// last: UI/Widgets/ktbs/ListBases.js

Samotraces.UI.Widgets.ktbs = Samotraces.UI.Widgets.ktbs || {};

/**
 * @class Generic Widget for visualising the available bases of a KTBS.
 * @author Benoît Mathern
 * @constructor
 * @augments Samotraces.Widgets.Widget
 * @description
 * TODO ecrire description
 * @todo ECRIRE LA DESCRIPTION
 * @param {String}	html_id
 *     Id of the DIV element where the widget will be
 *     instantiated
 * @param {Samotraces.Lib.KTBS} ktbs
 *     KTBS to bind to.
 * @param {Samotraces.Lib.EventHandler.EventConfig} [events]
 *     Events to listen to and their corresponding callbacks.
 */
Samotraces.UI.Widgets.ktbs.ListBases = function(html_id,ktbs,events) {
	// WidgetBasicTimeForm is a Widget
	Samotraces.UI.Widgets.Widget.call(this,html_id);
	Samotraces.EventHandler.call(this,events);
	this.add_class('Widget-ListBases');

	this.ktbs = ktbs;
	ktbs.on('ktbs:update',this.refresh.bind(this));

	this.init_DOM();
};

Samotraces.UI.Widgets.ktbs.ListBases.prototype = {
	init_DOM: function() {
		this.element.innerHTML = "";
		$(this.element).append('<h2>KTBS root: '+this.ktbs.get_uri()+'</h2>');
/*
		var title = document.createElement('h2');
		var title_text = document.createTextNode('KTBS root: '+this.ktbs.get_uri());
		title.appendChild(title_text);
		this.element.appendChild(title);
*/
		this.datalist_element = document.createElement('ul');
		this.element.appendChild(this.datalist_element);

		this.add_button = document.createElement('button');
		$(this.add_button).append('New base');
		this.element.appendChild(this.add_button);
		$(this.add_button).click(this.open_form.bind(this));
	},
	open_form: function() {

		this.add_button.disabled = true;

		this.form = {};

		this.form.input_id = document.createElement('input');
		this.form.input_id.size = 20;
		this.form.text1 = document.createTextNode(' Base ID: ');
		this.form.input_label = document.createElement('input');
		this.form.input_label.size = 20;
		this.form.text2 = document.createTextNode(' label: ');
		this.form.button = document.createElement('button');
		$(this.form.button).append('create');

		$(this.element).append(this.form.text1);
		$(this.element).append(this.form.input_id);
		$(this.element).append(this.form.text2);
		$(this.element).append(this.form.input_label);
		$(this.element).append(this.form.button);

		$(this.form.button).click(this.create_base.bind(this));

	},
	create_base: function(e) {
		if($(this.form.input_id).val() !== "") {
			console.log("Creating a new base...");
			this.ktbs.create_base($(this.form.input_id).val(),$(this.form.input_label).val());
		} else {
			console.log("Empty base name... No base created");
		}
		
		for( var k in this.form ) {
			$(this.form[k]).remove();
		}
		this.add_button.disabled = false;
	},
	refresh: function() {
		// clear
		this.datalist_element.innerHTML = '';
		var li_element;
		this.ktbs.list_bases().forEach(function(b) {
				li_element = document.createElement('li');
				li_element.appendChild(document.createTextNode(b));
				li_element.addEventListener('click',(function() {this.trigger('ui:click:base',b)}).bind(this));
				this.datalist_element.appendChild(li_element);
			},this);

	},
};




// last: UI/Widgets/ktbs/ListTracesInBases.js
Samotraces.UI.Widgets.ktbs = Samotraces.UI.Widgets.ktbs || {};

/**
 * @class Generic Widget for visualising the available bases of a KTBS.
 * @author Benoît Mathern
 * @constructor
 * @augments Samotraces.Widgets.Widget
 * @description
 * TODO ecrire description
 * @todo ECRIRE LA DESCRIPTION
 * @param {String}	html_id
 *     Id of the DIV element where the widget will be
 *     instantiated
 * @param {Samotraces.Lib.KTBS.Base} ktbs_base
 *     KTBS Base to bind to.
 * @param {Samotraces.Lib.EventHandler.EventConfig} [events]
 *     Events to listen to and their corresponding callbacks.
 */
Samotraces.UI.Widgets.ktbs.ListTracesInBases = function(html_id,ktbs_base,events) {
	// WidgetBasicTimeForm is a Widget
	Samotraces.UI.Widgets.Widget.call(this,html_id);
	Samotraces.EventHandler.call(this,events);
	this.add_class('Widget-ListTraces');

	this.base = ktbs_base;
	this.base.on('base:update',this.refresh.bind(this));

	this.init_DOM();
};

Samotraces.UI.Widgets.ktbs.ListTracesInBases.prototype = {
	init_DOM: function() {
		this.element.innerHTML = "";

		var title = document.createElement('h2');
		var title_text = document.createTextNode('Base: '+this.base.get_uri());
		title.appendChild(title_text);
		this.element.appendChild(title);

		this.datalist_element = document.createElement('ul');
		this.element.appendChild(this.datalist_element);

		this.remove_button = document.createElement('button');
		$(this.remove_button).append('Delete base');
		this.element.appendChild(this.remove_button);
		$(this.remove_button).click(this.remove_base.bind(this));

		this.add_button = document.createElement('button');
		$(this.add_button).append('New trace');
		this.element.appendChild(this.add_button);
		$(this.add_button).click(this.open_form.bind(this));

	},
	open_form: function() {

		this.add_button.disabled = true;

		this.form = {};

		this.form.input_id = document.createElement('input');
		this.form.input_id.size = 20;
		this.form.text1 = document.createTextNode(' Trace ID: ');
		this.form.input_label = document.createElement('input');
		this.form.input_label.size = 20;
		this.form.text2 = document.createTextNode(' label: ');
		this.form.button = document.createElement('button');
		$(this.form.button).append('create');

		$(this.element).append(this.form.text1);
		$(this.element).append(this.form.input_id);
		$(this.element).append(this.form.text2);
		$(this.element).append(this.form.input_label);
		$(this.element).append(this.form.button);

		$(this.form.button).click(this.create_trace.bind(this));

	},
	create_trace: function(e) {
		if($(this.form.input_id).val() !== "") {
			console.log("Creating a new trace...");
			this.base.create_stored_trace($(this.form.input_id).val(),null,null,null,$(this.form.input_label).val());
		} else {
			console.log("Empty trace name... No trace created");
		}
		
		for( var k in this.form ) {
			$(this.form[k]).remove();
		}
		this.add_button.disabled = false;
	},
	remove_base: function() {
		this.base.remove();
	},
	refresh: function() {
		// clear
		this.datalist_element.innerHTML = '';
		var li_element;
		this.base.list_traces().forEach(function(t) {
				li_element = document.createElement('li');
				li_element.appendChild(document.createTextNode(t['@id']));
				li_element.addEventListener('click',(function() {this.trigger('ui:click:trace',t['@id'])}).bind(this));
				this.datalist_element.appendChild(li_element);
			},this);

	},
	select: function() {
	}
};



	return Samotraces;
}));
