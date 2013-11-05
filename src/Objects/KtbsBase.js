
// REQUIRES JQUERY

// Check if relevant namespaces exist - or create them.
var Samotraces = Samotraces || {};
Samotraces.Objects = Samotraces.Objects || {};


/**
 * @class Javascript KtbsBase Object that is bound to a KTBS. 
 * @author Benoît Mathern
 * @requires jQuery framework (see <a href="http://jquery.com">jquery.com</a>)
 * @constructor
 * @augments Samotraces.Objects.Observable
 * @description
 * Samotraces.Objects.KtbsBase is a Javascript KTBS base
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
Samotraces.Objects.KtbsBase = function(url) {
	// Addint the Observable trait
	Samotraces.Objects.Observable.call(this);
	this.url = url;
	this.traces = [];
	this.refresh();
};

Samotraces.Objects.KtbsBase.prototype = {
	refresh: function() {
		jQuery.ajax({
				url: this.url+'.json',
				type: 'GET',
				dataType: 'json',
				success: this.parseRefreshResponse.bind(this)
			});
	},
	parseRefreshResponse: function(data) {
		console.log(data);
	//	var raw_json = Samotraces.Tools.xmlToJson(data);
	//	console.log(raw_json);
		
		var traces = [];
		data.contains.forEach(
			function(el) {
				traces.push(el['@id']);
			});

//		console.log('Method KtbsBase:parseRefreshResponse() not implemented yet...');
		// parse data to get list of bases and check if it has changed...
		if(this.traces !== traces) {
			this.traces = traces;
			this.notify('TracesListChanged',this.traces);
		}
	},
	/** @todo implement this method */
	autorefresh: function(period) {
		console.log('Method KtbsBase:autorefresh() not implemented yet...');
	},
	/** @todo implement this method */
	createTrace: function() {
		console.log('Method Ktbs:createBase() not implemented yet...');
	},
	getAllTracesIds: function() {
		return this.traces;
	},
	/**
	 * Create a Samotraces.Objects.KtbsBogueTrace Object
	 * corresponding to the given id.
	 * @param {String} id Id of the KtbsTrace to seek.
	 * @returns {Samotraces.Objects.KtbsBogueTrace}
	 *     KtbsTrace object.
	 */
	getKtbsTrace: function(id) {
		return new Samotraces.Objects.KtbsBogueTrace(this.url+id);
	},

};

// KtbsBase is Observable
//Samotraces.Objects.Observable.call(Samotraces.Objects.KtbsBase.prototype);


