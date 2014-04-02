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


