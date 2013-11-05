
// REQUIRES JQUERY

// Check if relevant namespaces exist - or create them.
var Samotraces = Samotraces || {};
Samotraces.Objects = Samotraces.Objects || {};

/**
 * @class Javascript Trace Object that is bound to a KTBS trace. 
 * @author Benoît Mathern
 * @requires jQuery framework (see <a href="http://jquery.com">jquery.com</a>)
 * @constructor
 * @augments Samotraces.Objects.Observable
 * @description
 * Samotraces.Objects.KtbsTrace is a Javascript Trace object
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
Samotraces.Objects.KtbsTrace = function(url) {
	// Addint the Observable trait
	Samotraces.Objects.Observable.call(this);
	this.url = url;
	var current_trace = this;

	/* Array d'obsels */
	this.traceSet = [];

	this.refreshObsels();
};

Samotraces.Objects.KtbsTrace.prototype = {

	newObsel: function(type,timeStamp,attributes) {
		var newObselOnSuccess = function() {
			this.refreshObsels();
		};

		var ttl_obsel = '@prefix : <http://liris.cnrs.fr/silex/2009/ktbs#> .\n@prefix m: <http://liris.cnrs.fr/silex/2011/simple-trace-model/> .\n@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n';
		ttl_obsel += '[ a "'+type+'" ;\n';
		ttl_obsel += '  :hasTrace <> ;\n';
//		ttl_obsel += '  rdf:type "'+type+'" ;\n';
		var readable_timestamp = new Date(timeStamp).toString();
		ttl_obsel += '  m:timestamp "'+readable_timestamp+'" ;\n';
		for(var key in attributes) {
			ttl_obsel += '  m:'+key+' "'+attributes[key]+'" ;\n';
		}

		ttl_obsel += '].';
		jQuery.ajax({
				url: this.url,
				type: 'POST',
				contentType: 'text/turtle',
				success: newObselOnSuccess.bind(this),
				data: ttl_obsel
			});
	},

	updateObsel: function(old_obs,new_obs) {
		console.log('Method KtbsTrace:updateObsel() not implemented yet...');
	},
	
	removeObsel: function(obs) {
		console.log('Method KtbsTrace:removeObsel() not implemented yet...');
	},
	
	getObsel: function(id) {
		console.log('Method KtbsTrace:getObsel() not implemented yet...');
	},

	refreshObsels: function() {
		jQuery.ajax({
				url: this.url+'@obsels.json',
				type: 'GET',
				dataType: 'json',
				success: this.refreshObselsSuccess.bind(this)
			});
	},

	refreshObselsSuccess: function(data) {
		var obsels = [];
		var id = '';
		var type = '';
		var timestamp = '';
		var attributes = {};
		data.obsels.forEach(
			function(el,key) {
				id = el['@id'];
				type = el['@type'];
				timestamp = el['begin'];
				attributes = el;
				obsels.push(new Samotraces.Objects.Obsel(id,timestamp,type,attributes));
			});
		this.traceSet = obsels;
		this.notify('updateTrace',this.traceSet);
	},

};

// Trace is Observable
//Samotraces.Objects.Observable.call(Samotraces.Objects.KtbsTrace.prototype);


