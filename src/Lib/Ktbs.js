
// REQUIRES JQUERY

// Check if relevant namespaces exist - or create them.
var Samotraces = Samotraces || {};
Samotraces.Objects = Samotraces.Objects || {};


/**
 * @class Javascript Ktbs Object that is bound to a KTBS. 
 * @author Benoît Mathern
 * @requires jQuery framework (see <a href="http://jquery.com">jquery.com</a>)
 * @constructor
 * @augments Samotraces.Objects.Observable
 * @description
 * Samotraces.Objects.Ktbs is a Javascript KTBS object that
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
Samotraces.Objects.Ktbs = function(url) {
	// Addint the Observable trait
	Samotraces.Objects.Observable.call(this);
	this.url = url;
	this.bases = [];
	this.refresh();
};

Samotraces.Objects.Ktbs.prototype = {
	refresh: function() {
		jQuery.ajax({
				url: this.url+'.xml',
				type: 'GET',
				dataType: 'xml',
				success: this.parseRefreshResponse.bind(this)
			});
	},
	parseRefreshResponse: function(data) {
		var raw_json = Samotraces.Tools.xmlToJson(data);
		console.log(raw_json);
		
		var bases = [];
		raw_json['rdf:RDF']['rdf:Description']['hasBase'].forEach(
			function(el) {
				bases.push(el['@attributes']['rdf:resource']);
			});

//		console.log('Method Ktbs:parseRefreshResponse() not implemented yet...');
		// parse data to get list of bases and check if it has changed...
		if(this.bases !== bases) {
			this.bases = bases;
			this.notify('BasesListChanged',this.bases);
		}
	},
	/** @todo implement this method */
	autorefresh: function(period) {
		console.log('Method Ktbs:autorefresh() not implemented yet...');
	},
	/** @todo implement this method */
	createBase: function() {
		console.log('Method Ktbs:createBase() not implemented yet...');
	},
	getAllBasesIds: function() {
		return this.bases;
	},
	/**
	 * Create a Samotraces.Objects.KtbsBase Object
	 * corresponding to the given id.
	 * @param {String} id Id of the KtbsBase to seek.
	 * @returns {Samotraces.Objects.KtbsBase}
	 *     KtbsBase object.
	 */
	getKtbsBase: function(id) {
		return new Samotraces.Objects.KtbsBase(this.url+id);
	},

};

// Ktbs is Observable
//Samotraces.Objects.Observable.call(Samotraces.Objects.Ktbs.prototype);


