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

