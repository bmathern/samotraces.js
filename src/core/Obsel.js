/**
 * Obsel is a shortname for the 
 * {@link Samotraces.Obsel}
 * object.
 * @typedef Obsel
 * @see Samotraces.Obsel
 */
/**
 * @summary JavaScript Obsel class
 * @class JavaScript Obsel class
 * @param {Object} param Parameters 
 * @param {String} param.id Identifier of the obsel.
 * @param {Number} param.begin Timestamp of the obsel
 * @param {Number} param.end Timestamp of the obsel
 * @param {String} param.type Type of the obsel.
 * @param {Object} [param.attributes] Attributes of the obsel.
 * @param {Array<Object>} [param.attributes] Attributes of the obsel.
 * @param {Array<FIXME>} [param.relations] Relations from this obsel.
 * @param {Array<FIXME>} [param.inverse_relations] Relations to this obsel.
 * @param {Array<Obsel>} [param.source_obsels] Source obsels of the obsel.
 * @param {String} [param.label] Label of the obsel.
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
	_private_check_default: function (param,attr,value) {
		this[attr] = (param[attr] !== undefined)?param[attr]:value;
	},
	_private_check_undef: function (param,attr) {
		if(param[attr] !== undefined) {
			this[attr] = param[attr];
		}
	},
	_private_check_error: function (param,attr) {
		if(param[attr] !== undefined) {
			this[attr] = param[attr];
		} else {
			throw "Parameter "+attr+" required.";
		}
	},
	// RESOURCE
	remove: function() {
		this.get_trace().remove_obsel(this);
	},
	get_id: function() { return this.id; },
	get_label: function() { return this.label; },
	set_label: function(lbl) { this.label = lbl; },
	reset_label: function() { this.label = ""; },
	// OBSEL
	get_trace: 		function() { return this.trace; },
	get_obsel_type: function() { return this.type;	},
	get_begin: 		function() { return this.begin;	},
	get_end: 		function() { return this.end;	},
	list_source_obsels: 	function() {
		if(this.list_source_obsels === undefined) { return []; }
		return this.source_obsels;
	},
	list_attribute_types: 	function() {
		if(this.attributes === undefined) { return []; }
		var attrs = []
		for(var key in this.attributes) { attrs.push(key); }
		return attrs;
	},
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
	get_attribute:	function(attr) {
		if(this.attributes[attr] === undefined) {
			throw "Attribute "+attr+" is not defined"; // TODO
		} else {
			return this.attributes[attr];
		}
	},
//	del_attribute_value:	function(attr) {}, // TODO erreur de l'API KTBS?
	set_attribute:	function(attr, val) {
		this.attributes[attr] = val;
		this.trace.trigger('trace:edit:obsel',this);
		// TODO envoyer un event pour dier que l'obsel a changé
	},
//	del_attribute_value:	function(attr) {}, // TODO erreur de l'API KTBS?
	del_attribute:			function(attr) {
		delete this.attributes[attr];
		this.trace.trigger('trace:edit:obsel',this);
		// TODO envoyer un event pour dier que l'obsel a changé
	},
	add_related_obsel:		function(rel,obs) {
		// TODO
		throw "method not implemented yet";
		// TODO envoyer un event pour dier que l'obsel a changé
	},
	del_related_obsel:		function(rel,obs) {
		// TODO
		throw "method not implemented yet";
		// TODO envoyer un event pour dier que l'obsel a changé
	},

	// NOT IN KTBS API
	to_constructor: function() { 
		return {
			id: this.id,
			type: this.type,
			begin: this.begin,
			end: this.end,
			attributes: this.attributes,
			relations: this.relations,
			inverse_relations: this.inverse_relations,
			source_obsels: this.source_obsels,
			label: this.label	
		};
	},
};


