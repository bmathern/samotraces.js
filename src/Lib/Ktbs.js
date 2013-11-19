
// REQUIRES JQUERY

// Check if relevant namespaces exist - or create them.
var Samotraces = Samotraces || {};
Samotraces.Lib = Samotraces.Lib || {};


/**
 * @class Javascript Ktbs Object that is bound to a KTBS. 
 * @author Benoît Mathern
 * @requires jQuery framework (see <a href="http://jquery.com">jquery.com</a>)
 * @constructor
 * @augments Samotraces.Lib.EventHandler
 * @description
 * Samotraces.Lib.Ktbs is a Javascript KTBS object that
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
Samotraces.Lib.Ktbs = function(url) {
	// Addint the Observable trait
	Samotraces.Lib.EventHandler.call(this);
	this.url = url;
	this.bases = [];
	this.refresh();


	/**
	 * @class Javascript KtbsBase Object that is bound to a KTBS. 
	 * @author Benoît Mathern
	 * @requires jQuery framework (see <a href="http://jquery.com">jquery.com</a>)
	 * @constructor
	 * @augments Samotraces.Lib.EventHandler
	 * @description
	 * Samotraces.Lib.KtbsBase is a Javascript KTBS base
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
	var KtbsBase = function(url) {
		// Addint the Observable trait
		Samotraces.Lib.EventHandler.call(this);
		this.url = url;
		this.traces = [];
		this.refresh();
	};

	KtbsBase.prototype = {
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
				this.trigger('TracesListChanged',this.traces);
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
		 * @returns {Samotraces.Lib.KtbsBogueTrace}
		 *     KtbsTrace object.
		 */
		getKtbsTrace: function(id) {
			return new Samotraces.Lib.KtbsBogueTrace(this.url+id);
		},

	};

	/**
	 * @class Javascript Trace Object that is bound to a KTBS trace. 
	 * @author Benoît Mathern
	 * @requires jQuery framework (see <a href="http://jquery.com">jquery.com</a>)
	 * @constructor
	 * @mixes Samotraces.Lib.EventHandler
	 * @description
	 * Samotraces.Lib.KtbsTrace is a Javascript Trace object
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
	var KtbsTrace = function(url) {
		// Addint the Observable trait
		Samotraces.Lib.EventHandler.call(this);
		this.url = url;
		var current_trace = this;

		/* Array d'obsels */
		this.traceSet = [];

		this.refreshObsels();
	};

	KtbsTrace.prototype = {

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
					obsels.push(new Samotraces.Lib.Obsel(id,timestamp,type,attributes));
				});
			this.traceSet = obsels;
			this.trigger('updateTrace',this.traceSet);
		},

	};

};

Samotraces.Lib.Ktbs.prototype = {
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
			this.trigger('BasesListChanged',this.bases);
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
	 * Create a Samotraces.Lib.KtbsBase Object
	 * corresponding to the given id.
	 * @param {String} id Id of the KtbsBase to seek.
	 * @returns {Samotraces.Lib.KtbsBase}
	 *     KtbsBase object.
	 */
	getKtbsBase: function(id) {
		return new KtbsBase(this.url+id);
	},

};



