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

