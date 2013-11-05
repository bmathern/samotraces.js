
// REQUIRES JQUERY

// Check if relevant namespaces exist - or create them.
var Samotraces = Samotraces || {};
Samotraces.Lib = Samotraces.Lib || {};


/* Classe Trace */
Samotraces.Lib.KtbsBogueTrace = function(url) {
	// Addint the Observable trait
	Samotraces.Lib.Observable.call(this);
	this.url = url;
	var current_trace = this;

	/* Array d'obsels */
	this.traceSet = [];

	this.refreshObsels();
};

Samotraces.Lib.KtbsBogueTrace.prototype = {

	newObsel: function(type,timeStamp,attributes) {
		var newObselOnSuccess = function(data,textStatus,jqXHR) {
			var url = jqXHR.getResponseHeader('Location');
			var url_array = url.split('/');
			var obsel_id = url_array[url_array.length -1];
			this.getNewObsel(obsel_id);
		};

		var ttl_obsel = '@prefix : <http://liris.cnrs.fr/silex/2009/ktbs#> .\n@prefix m: <http://liris.cnrs.fr/silex/2011/simple-trace-model/> .\n';
		ttl_obsel += '[ a m:SimpleObsel ;\n';
		ttl_obsel += '  :hasTrace <> ;\n';
		ttl_obsel += '  m:type "'+type+'" ;\n';
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
	getObsel: function(obs) {
		console.log('Method KtbsTrace:getObsel() not implemented yet...');
	},
	
	getNewObsel: function(id) {
		jQuery.ajax({
				url: this.url+id+'.xml',
				type: 'GET',
				success: this.getNewObselSuccess.bind(this),
			});
	},
	getNewObselSuccess: function(data,textStatus,jqXHR) {
		// workaround to get the id eventhough the ktbs doesn't return it.
		var url = jqXHR.getResponseHeader('Content-Location');
		var url_array = url.split('/');
		var obsel_id = url_array[url_array.length -1];
		if(obsel_id.endsWith('.xml')) {
			obsel_id = obsel_id.substr(0,obsel_id.length-4);
		}
				
		var raw_json = Samotraces.Tools.xmlToJson(data);
		var obsels = [];
		var obs;
		el = raw_json['rdf:RDF']['rdf:Description'];
		obs = this.rdf2obs(el);
		if(obs !== undefined) {
			obs.id = obsel_id; 
			this.traceSet.push(obs);
			this.notify('newObsel',obs);
		}
	},

	refreshObsels: function() {
		jQuery.ajax({
				url: this.url+'@obsels.xml',
				type: 'GET',
				contentType: 'text/turtle',
				success: this.refreshObselsSuccess.bind(this)
			});
	},
	refreshObselsSuccess: function(data) {
			var raw_json = Samotraces.Tools.xmlToJson(data);
			var obsels = [];
			raw_json['rdf:RDF']['rdf:Description'].forEach(
				function(el,key) {
					var obs = this.rdf2obs(el);
					if(obs !== undefined) {
						obsels.push(obs);
					}
				},this);
			this.traceSet = obsels;
			this.notify('updateTrace',this.traceSet);
	},

	rdf2obs: function(el) {
		var obs;
		if( el['ns1:type'] !== undefined ) {
			attributes = {};
			var id = '';
			var type = '';
			var timestamp = '';
			var attributes = {};
			for(var key in el) {
				switch(key) {
					case '@attributes':
						id = el[key]['rdf:about'];
						break;
					case 'ns1:type':
						type = el[key]['#text'];
						break;
					case 'ns1:timestamp':
						timestamp = el[key]['#text'];
						break;
					default:
						attributes[key] = el[key]['#text'];
						break;
				}
			}
			obs = new Samotraces.Lib.Obsel(id,timestamp,type,attributes);
		}
		return obs;
	},
};

