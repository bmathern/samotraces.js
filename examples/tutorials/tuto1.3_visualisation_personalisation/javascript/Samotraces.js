
// THIS FILE MUST BE INCLUDED FIRST!!!

// Check if relevant namespaces exist - or create them.
var Samotraces = Samotraces || {};
Samotraces.Lib = Samotraces.Lib || {};

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
 * Samotraces.Lib.EventHandler.call(this);
 * </code>
 *
 * @property {Object} callbacks
 *     Hash matching callbacks to event_types.
 */
Samotraces.Lib.EventHandler = (function() {
	/**
	 * Triggers all the registred callbacks.
	 * @memberof Samotraces.Lib.EventBuilder.prototype
	 * @param {String} event_type
	 *     The type of the triggered event.
	 * @param {Object} object
	 *     Object sent with the message to the listeners (see 
	 *     {@link Samotraces.Lib.EventBuilder#addEventListener}).
	 */
	function trigger(event_type,object) {
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
	 * @memberof Samotraces.Lib.EventBuilder.prototype
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
	function addEventListener(event_type,callback) {
		if({}.toString.call(callback) !== '[object Function]') {
			console.log(callback);
			throw "Callback for event "+event_type+" is not a function";
		}
		this.callbacks[event_type] = this.callbacks[event_type] || [];
		this.callbacks[event_type].push(callback);
	}
	return function() {
		// DOCUMENTED ABOVE
		this.callbacks = this.callbacks || {};
		this.trigger = trigger;
		this.addEventListener = addEventListener;
		return this;
	};
})();



/* TODO:
 * Plutot que d'attacher les Espions à des targetTypes,
 * il vaudrait mieux faire comme dans jQuery: attacher les eventsListeners à des
 * éléments de plus haut niveau (body par exemple) et dynamiquement filtrer les
 * targetTypes.
 * Cela permet de gérer du contenu de pages web dynamique.
 */

// Check if relevant namespaces exist - or create them.
var Samotraces = Samotraces || {};
Samotraces.Lib = Samotraces.Lib || {};

Samotraces.Lib.Collecteur = function() {
		this.espions = [];
};

Samotraces.Lib.Collecteur.prototype = {
	addEspion: function(eventTypes,targetTypes,eventCallback,trace) {
		espion = new Samotraces.Lib.Espion(eventTypes,targetTypes,eventCallback,trace);
		this.espions.push(espion);
	},
	addIFrameEspion: function(eventTypes,targetTypes,eventCallback,trace,iframeId) {
		espion = new Samotraces.Lib.IFrameEspion(eventTypes,targetTypes,eventCallback,trace,iframeId);
		this.espions.push(espion);
	},
	start: function() {
		this.espions.forEach(function(espion) {
			espion.start();
		});
	},
/*
	stop: function() {
		this.espions.each(function(espion) {
			espion.stop();
		});
	},
*/
};

Samotraces.Lib.Espion = function(eventTypes,targetTypes,eventCallback,trace) {
	this.eventTypes = eventTypes.split(',');
	this.targetTypes = targetTypes.split(',');
	this.eventCallback = eventCallback;
	this.trace = trace;
};

Samotraces.Lib.Espion.prototype = {
	start: function() {
		var elements;
		this.eventTypes.forEach(function(eventType) {
			this.targetTypes.forEach(function(targetType) {
//console.log('addEventListener:'+targetType+':'+eventType);
				elements = document.getElementsByTagName(targetType);
				for(var item=0 ; item < elements.length ; item++ ) {
					elements.item(item).addEventListener(eventType,this.eventCallback);	
				}
			},this);
		},this);
	},
};


Samotraces.Lib.IFrameEspion = function(eventTypes,targetTypes,eventCallback,trace,iframeId) {
	this.iframeId = iframeId;
	this.eventTypes = eventTypes.split(',');
	this.targetTypes = targetTypes.split(',');
	this.eventCallback = eventCallback;
	this.trace = trace;
};

Samotraces.Lib.IFrameEspion.prototype = {
	start: function() {
		var elements;
		var iframe_element = document.getElementById(this.iframeId);
		this.eventTypes.forEach(function(eventType) {
			this.targetTypes.forEach(function(targetType) {
		//		console.log(iframe_element);
				elements = iframe_element.contentWindow.document.getElementsByTagName(targetType);
		//		console.log("Attached Espion on tags "+targetType+" for event "+eventType);
		//		console.log(this.eventCallback);
		//		console.log(elements);
				for(var i=0 ; i < elements.length ; i++) {
				//	console.log(i);
				//console.log(elements.item(item).addEventListener);
					elements.item(i).addEventListener(eventType,this.eventCallback);	// function(e) {console.log(e);});
				}
			},this);
		},this);
	}
};


var Samotraces = Samotraces || {};
Samotraces.Lib = Samotraces.Lib || {};

/**
 * @summary JavaScript Obsel class
 * @class JavaScript Obsel class
 * @param {String} id Identifier of the obsel.
 * @param {Number} timestamp Timestamp of the obsel
 * @param {String} type Type of the obsel.
 * @param {Object} attributes Optional attributes of the obsel.
 */
Samotraces.Lib.Obsel = function(id,timestamp,type,attributes) {
	this.id = id;
	this.timestamp = timestamp;
	this.type = type;
	this.attributes = attributes;
};



// Check if relevant namespaces exist - or create them.
var Samotraces = Samotraces || {};
Samotraces.Lib = Samotraces.Lib || {};

/**
 * @summary Object that stores the currently selected obsel
 * @class Object that stores the currently selected obsel
 * @author Benoît Mathern
 * @constructor
 * @augments Samotraces.Lib.EventHandler
 * @description
 * The {@link Samotraces.Lib.ObselSelector|ObselSelector} object
 * is a Javascript object that stores the currently selected obsel.
 * This Object stores an obsel that is selected and informs 
 * widgets or other objects (via the 
 * {@link Samotraces.Lib.ObselSelector#event:obselSelected|obselSelected}
 * and the 
 * {@link Samotraces.Lib.ObselSelector#event:obselUnselected|obselUnselected}
 * events) when the selected object changes
 * or if the obsel has been unselected. When first instanciated,
 * no obsel is selected.
 *
 * In order to select an obsel, the 
 * {@link Samotraces.Lib.ObselSelector#select|ObselSelector#select()} 
 * method has to be called.
 * Similarly, in order to unselect an obsel, the 
 * {@link Samotraces.Lib.ObselSelector#unselect|ObselSelector#unselect()} 
 * method has to be called.
 * 
 * Note: selecting a new obsel is equivalent to unselecting 
 * the current obsel and selecting the new obsel, except
 * that the widget listening to the 
 * {@link Samotraces.Lib.ObselSelector} events will only 
 * receive a
 * {@link Samotraces.Lib.ObselSelector#event:obselSelected|obselSelected}, 
 * and no 
 * {@link Samotraces.Lib.ObselSelector#event:obselUnselected|obselUnselected}
 * event.
 */
Samotraces.Lib.ObselSelector = function() {
	// Adding the Observable trait
	Samotraces.Lib.EventHandler.call(this);
	this.obsel = undefined;
};

Samotraces.Lib.ObselSelector.prototype = {
	/**
     * Method to call to select an obsel.
     * This method is typically called from widgets that can
     * visualise a trace. For instance, clicking on an obsel
     * displayed with the 
     * {@link Samotraces.Widgets.TraceDisplayIcons|TraceDisplayIcons}
     * widget, will call this method to select the obsel that
     * had been the target of the click.
     * @param {Samotraces.Lib.Obsel} obsel
     *     {@link Samotraces.Lib.Obsel|Obsel} object that is 
	 *     selected.
	 * @fires Samotraces.Lib.ObselSelector#obselSelected
     */
	select: function(obsel) {
		this.obsel = obsel;
		/**
		 * Obsel selected event.
		 * @event Samotraces.Lib.ObselSelector#obselSelected
		 * @type {object}
		 * @property {String} type - The type of the event (= "obselSelected").
		 * @property {Samotraces.Lib.Obsel} data - The selected obsel.
		 */
		this.trigger('obselSelected',obsel);
	},
	/**
     * Method to call to unselect an obsel.
     * This method is typically called from widgets that can
     * visualise an obsel.
	 * @fires Samotraces.Lib.ObselSelector#obselUnselected
     */
	unselect: function() {
		this.obsel = undefined;
		/**
		 * Obsel unselected event.
		 * @event Samotraces.Lib.ObselSelector#obselUnselected
		 * @type {object}
		 * @property {String} type - The type of the event (= "obselUnselected").
		 */
		this.trigger('obselUnselected');
	}
};


// Check if relevant namespaces exist - or create them.
var Samotraces = Samotraces || {};
Samotraces.Lib = Samotraces.Lib || {};

/**
 * @summary Javascript Trace Object.
 * @class Javascript Trace Object.
 * @author Benoît Mathern
 * @constructor
 * @mixes Samotraces.Lib.EventHandler
 * @augments Samotraces.Lib.Trace
 * @description
 * Samotraces.Lib.DemoTrace is a Javascript Trace object.
 * Methods are available to get 
 * the Obsels from the trace, create new Obsels, etc.
 *
 * The trace is initialised empty. Obsels have to be created
 * by using the {@link Samotraces.Lib.DemoTrace#newObsel} method.
 */
Samotraces.Lib.DemoTrace = function() {
	// Addint the Observable trait
	Samotraces.Lib.EventHandler.call(this);
	var current_trace = this;

	/* Nombre d'obsels dans la trace */
	this.count = 0; // sert d'ID pour le prochain observé.
	/* Array d'obsels */
	this.traceSet = [];

};

Samotraces.Lib.DemoTrace.prototype = {
	/**
	 * Creates a new obsel in the trace.
	 * @param {String} type Type of the new obsel
	 * @param {Number} timeStamp Timestamp of the new obsel
	 * @param {Object} attributes Additional attributes of the
	 *     new obsel.
	 * @todo update documentation by creating (fake) Trace
	 * object from which each trace object must inherit.
	 * This way, all traces have the same documentation.
	 * @fires Samotraces.Lib.Trace#updateTrace
	 * @todo use KTBS abstract API.
	 */
	newObsel: function(type,timeStamp,attributes) {
		var id = this.count;
		this.count++;
		this.traceSet.push(new Samotraces.Lib.Obsel(id,timeStamp,type,attributes));
		this.trigger('updateTrace',this.traceSet);
	},

	updateObsel: function(old_obs,new_obs) {
		console.log('Method KtbsTrace:updateObsel() not implemented yet...');
//		this.traceSet.erase(old_obs);
//		new_obs.id = old_obs.id; // check that id stay consistent
//		this.traceSet.push(new_obs);
//		this.notify('updateObsel',{old_obs: old_obs, new_obs: new_obs});
//		return new_obs;
	},
	
	removeObsel: function(obs) {
		console.log('Method KtbsTrace:removeObsel() not implemented yet...');
//		this.traceSet.erase(old_obs);
//		this.notify('removeObsel',obs);
	},
	
	getObsel: function(id) {
		console.log('Method KtbsTrace:getObsel() not implemented yet...');
	},

};



// REQUIRES JQUERY

// Check if relevant namespaces exist - or create them.
var Samotraces = Samotraces || {};
Samotraces.Lib = Samotraces.Lib || {};


/**
 * @summary JavaScript Trace class connected to a kTBS
 * @class JavaScript Trace class connected to a kTBS
 * @augments Samotraces.Lib.Trace
 */
Samotraces.Lib.KtbsBogueTrace = function(url) {
	// Addint the Observable trait
	Samotraces.Lib.EventHandler.call(this);
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
	/**
	 * @fires Samotraces.Lib.Trace#newObsel
	 */
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
			this.trigger('newObsel',obs);
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
	/**
	 * @fires Samotraces.Lib.Trace#updateTrace
	 */
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
			this.trigger('updateTrace',this.traceSet);
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


// REQUIRES JQUERY

// Check if relevant namespaces exist - or create them.
var Samotraces = Samotraces || {};
Samotraces.Lib = Samotraces.Lib || {};

/**
 * @summary Javascript Trace Object that is bound to a KTBS trace. 
 * @class Javascript Trace Object that is bound to a KTBS trace. 
 * @author Benoît Mathern
 * @requires jQuery framework (see <a href="http://jquery.com">jquery.com</a>)
 * @requires ktbs4js (see <a href="https://github.com/oaubert/ktbs4js">on github</a>)
 * @constructor
 * @augments Samotraces.Lib.EventHandler
 * @description
 * Samotraces.Lib.Ktbs4jsTrace is a Javascript Trace object
 * that is bound to a KTBS trace. This Object wraps the 
 * ktbs4js API to the KTBS to make it compatible with the
 * Samotraces framework.
 *
 * @param {String}	url	Url of the KTBS trace to load.
 */
Samotraces.Lib.Ktbs4jsTrace = function(url) {
	// Addint the Observable trait
	Samotraces.Lib.EventHandler.call(this);

	this.trace = tracemanager.init_trace('trace1',{url: url, syncmode: 'sync', format: 'turtle'});
	this.traceSet = this.trace.obsels;
	$(this.trace).on('updated',this.onUpdate.bind(this));
	this.trace.force_state_refresh();
};

Samotraces.Lib.Ktbs4jsTrace.prototype = {
	onUpdate: function() {
		this.traceSet = this.trace.obsels;
		this.trigger('updateTrace',this.obsels);
	},
	newObsel: function(type,timeStamp,attributes) {
		this.trace.trace(type,attributes,timeStamp);
	},

};



// REQUIRES JQUERY

// Check if relevant namespaces exist - or create them.
var Samotraces = Samotraces || {};
Samotraces.Lib = Samotraces.Lib || {};


/**
 * @summary Javascript Ktbs Object that is bound to a KTBS. 
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
Samotraces.Lib.Ktbs = function(uri) {
//	this.url = url;
//	this.bases = [];
//	this.refresh();

	/* MIXIN */
	var Resource = (function(id,uri,label) {
		
		// RESOURCE API
		function get_id() { return this.id; }
		function get_uri() { return this.uri; }
		function force_state_refresh() {
			$.ajax({
				url: this.uri+'.json',
				type: 'GET',
				dataType: 'json',
				success: this._on_state_refresh_.bind(this),
				error: function(jqXHR,textStatus,error) {
					console.log("Error in force_state_refresh():");
					if(textStatus == "parsererror") {
						console.log("--> parsererror -->");
						console.log(jqXHR.responseText);
					}
				}
			});
		}
		function start_auto_refresh(period) {
			this.auto_refresh_id?this.stop_auto_refresh():null;
			this.auto_refresh_id = window.setInterval(this.force_state_refresh.bind(this), period/1000);
		}
		function stop_auto_refresh() {
			if(this.auto_refresh_id) {
				window.clearInterval(this.auto_refresh_id);
				delete(this.auto_refresh_id);
			}
		}
//		function _on_state_refresh_(data) { this.data = data; console.log("here"); }
		function get_read_only() {}
		function remove() {}
		function get_label() {}
		function set_label() {}
		function reset_label() {}

		// ADDED FUNCTIONS
		function _check_change_(local_field,distant,message_if_changed) {
			if(this[local_field] !== distant) {
				this[local_field] = distant;
				this.trigger(message_if_changed);
			}
		}

		return function(id,uri) {
			// a Resource is an EventHandler
			Samotraces.Lib.EventHandler.call(this);
			// DOCUMENTED ABOVE
			// ATTRIBUTES
			this.id = id;
			this.uri = uri;
			this.label = label;
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
			this._check_change_ = _check_change_;
			this.start_auto_refresh = start_auto_refresh;
			this.stop_auto_refresh = stop_auto_refresh;
			return this;
		};
	})();

	// KTBS is a Resource
	Resource.call(this,uri,uri,"");
	this.bases = [];
	this.builtin_methods = [];
	this.force_state_refresh();


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
	var Base = function(id,uri) {
		// KTBS.Base is a Resource
		Resource.call(this,id,uri,"");
		this.traces = [];
		this.force_state_refresh();
	};
	this.Base = Base;

	Base.prototype = {
		get: function(id) {},
		list_traces: function() {
			return this.traces;
		},
		list_models: function() {},
		create_stored_trace: function(id,model,origin,default_subject,label) {},
		create_computed_trace: function(id,method,parameters,sources,label) {},
		create_model: function(id,parents,label) {},
		create_method: function(id,parent,parameters,label) {},
///////////
		_on_state_refresh_: function(data) {
		//	console.log(data);
			this._check_change_('label',data["http://www.w3.org/2000/01/rdf-schema#label"],'updated');
			this._check_change_('traces', data.contains, 'updated');
		},
/////////// ADDED / API
		get_trace: function(id) {
			return new Trace(id,this.uri+id);
		},
////////////
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
	var Trace = function(id,uri) {
		// KTBS.Base is a Resource
		Resource.call(this,id,uri,"");

		this.default_subject = "";
		this.model_uri = "";
		this.obsel_list_uri = "";
		this.base_uri = "";
		this.origin = "";
		this.obsel_list = []; this.traceSet = [];

		this.force_state_refresh();
	};
	this.Trace = Trace;

	Trace.prototype = {
/////////// OFFICIAL API
		get_base: function() {},
		get_model: function() {},
		get_origin: function() {},
		list_source_traces: function() {},
		list_transformed_traces: function() {},
		list_obsels: function(begin,end,reverse) {
			if(this.obsel_list_uri === "") {
				console.log("Error in Ktbs:Trace:list_obsels() unknown uri");
				return false;
			}
			$.ajax({
				url: this.obsel_list_uri+'.json',
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
		get_obsel: function(id) {},
///////////
		_on_state_refresh_: function(data) {
	//		console.log(data);
			this._check_change_('default_subject', data.hasDefaultSubject, '');
			this._check_change_('model_uri', data.hasModel, '');
			this._check_change_('obsel_list_uri', data.hasObselList, 'updateTrace');
			this._check_change_('base_uri', data.inBase, '');
			this._check_change_('origin', data.origin, '');
		},
///////////
		_on_refresh_obsel_list_: function(data) {
	//		console.log(data);
			var id, label, type, begin, end, attributes, obs;
			var new_obsel_loaded = false;
			data.obsels.forEach(function(el,key) {
				id = el['@id'];
				label = el['http://www.w3.org/2000/01/rdf-schema#label'] || undefined;
				type = el['@type'];
				begin = el['begin'];
				end = el['end'];
				attributes = el;
				delete(attributes['@id']);
				delete(attributes['http://www.w3.org/2000/01/rdf-schema#label']);
				delete(attributes['@type']);
				delete(attributes['begin']);
				delete(attributes['end']);
				obs = new Obsel(id,this.uri+id,label,this.id,type,begin,end,attributes);
				
				if(! this._check_obsel_loaded_(obs)) {
					new_obsel_loaded = true;
				}
			},this);
			if(new_obsel_loaded) {
				this.trigger('updateTrace',this.traceSet);
			}
		},
		_check_obsel_loaded_: function(obs) {
			if(this.obsel_list.some(function(o) {
				return o.get_id() == obs.get_id(); // first approximation: obsel has the same ID => it is already loaded... We don't check if the obsel has changed!
			})) {
				return true;
			} else {
				this.obsel_list.push(obs);
				this._compatibility_();
				return false;
			}
		},
///////////
		_compatibility_: function() {
			this.traceSet = this.obsel_list;
		}
	};
// */

	var Obsel = function(id,uri,label,trace,type,begin,end,attributes,relations) {
		// KTBS.Base is a Resource
		Resource.call(this,id,uri,label || "");
		this.trace = trace;
		this.type = type;
		this.begin = begin;
		this.end = end;
		this.attributes = attributes || {};
		this.relations = relations || {};
	}
	this.Obsel = Obsel;

	Obsel.prototype = {
		get_trace: function() { return this.trace; },
		get_obsel_type: function() { return this.type; },
		get_begin: function() { return this.begin; },
		get_end: function() { return this.end; },
		list_source_obsels: function() {},
		list_attribute_types: function() {},
		list_relation_types: function() {},
		list_related_obsels: function() {},
		list_inverse_relation_types: function() {},
		get_attribute_value: function() {},
		set_attribute_value: function() {},
		gel_attribute_value: function() {},
		add_related_obsel: function() {},
		del_related_obsel: function() {}
	};
};

Samotraces.Lib.Ktbs.prototype = {
/////////// OFFICIAL API
	list_builtin_methods: function() {},
	get_builtin_method: function() {},
	list_bases: function() {
		return this.bases;
	},
	/**
	 * @param id {String} URI of the base
	 */
	get_base: function(id) {
		return new this.Base(id,this.uri+id);
	},
	/**
	 * @param id {String} URI of the base (optional)
	 * @param label {String} Label of the base (optional)
	 */
	create_base: function(id, label) {
/*
		$.ajax({
			url: this.uri,
			type: 'GET',
			dataType: 'json',
			success: this._on_state_refresh_.bind(this)
		});
*/
	},
///////////
	_on_state_refresh_: function(data) {
	//	console.log(data);
		this._check_change_('bases', data.hasBase, 'updated');
		this._check_change_('builtin_methods', data.hasBuildinMethod, 'updated');
	},
///////////
};




var Samotraces = Samotraces || {};
Samotraces.Lib = Samotraces.Lib || {};

/**
 * @summary Object that stores the current time
 * @class Object that stores the current time
 * @author Benoît Mathern
 * @constructor
 * @augments Samotraces.Lib.EventBuilder
 * @description
 * Samotraces.Lib.Timer is a Javascript object that stores
 * the current time.
 * This Object stores a time and informs widgets or other
 * objects when the time changes.
 *
 * @param {Number} time Initial time of the timer (optional, default: 0).
 */

Samotraces.Lib.Timer = function(time) {
	// Adding the Observable trait
	Samotraces.Lib.EventHandler.call(this);
	this.time = time || 0;
};

Samotraces.Lib.Timer.prototype = {
	/**
	 * Sets the Timer to the given time.
	 * @fires Samotraces.Lib.Timer#updateTime
	 * @param {Number} time New time
	 */
	set: function(time) {
		new_time = Number(time);
		if(this.time != new_time) {
			this.time = new_time; 
			/**
			 * Time change event.
			 * @event Samotraces.Lib.Timer#updateTime
			 * @type {object}
			 * @property {String} type - The type of the event (= "updateTime").
			 */
			this.trigger('updateTime',this.time);
		}
	}
};


var Samotraces = Samotraces || {};
Samotraces.Lib = Samotraces.Lib || {};

Samotraces.Lib.SelfUpdatingTimer = function(init_time,period,update_function) {
	// Addint the Observable trait
	Samotraces.Lib.EventHandler.call(this);
	this.time = init_time || 0;
	this.period = period || 2000;
	this.update_function = update_function || function() {return Date.now();};
	this.is_playing = false;
};

Samotraces.Lib.SelfUpdatingTimer.prototype = {
	/**
	 * Sets the Timer to the given time.
	 * @fires Samotraces.Lib.Timer#updateTime
	 * @param {Number} time New time
	 */
	set: function(time) {
		new_time = Number(time);
		if(this.time != new_time) {
			this.time = new_time; 
			/**
			 * Time change event.
			 * @event Samotraces.Lib.Timer#updateTime
			 * @type {object}
			 * @property {String} type - The type of the event (= "updateTime").
			 */
			this.trigger('updateTime',this.time);
		}
	},
	/**
	 * Sets or get the Timer's current time.
	 * If no parameter is given, the current time is returned.
	 * Otherwise, sets the Timer to the givent time.
	 * @fires Samotraces.Lib.Timer#updateTime
	 * @param {Number} time New time (optional)
	 */
	time: function(time) {
		if(time) {
			new_time = Number(time);
			if(this.time != new_time) {
				this.time = new_time; 
				/**
				 * Time change event.
				 * @event Samotraces.Lib.Timer#updateTime
				 * @type {object}
				 * @property {String} type - The type of the event (= "updateTime").
				 */
				this.trigger('updateTime',this.time);
			}
		} else {
			return this.time;
		}
	},

	play: function() {
		var update = function() {
			this.time = this.update_function(this.time);
			this.trigger('updateTimePlay',this.time);
		};
		this.interval_id = window.setInterval(update.bind(this),this.period);
		this.is_playing = true;
		this.trigger('play',this.time);
	},
	pause: function() {
		window.clearInterval(this.interval_id);
		this.is_playing = false;
		this.trigger('pause',this.time);
	}
};

// Timer is Observable
//Samotraces.Objects.Observable.call(Samotraces.Objects.SelfUpdatingTimer.prototype);

// Check if relevant namespaces exist - or create them.
var Samotraces = Samotraces || {};
Samotraces.Lib = Samotraces.Lib || {};

/**
 * @summary Object that stores the current time window
 * @class Object that stores the current time window
 * @author Benoît Mathern
 * @constructor
 * @augments Samotraces.Lib.EventHandler
 * @description
 * The {@link Samotraces.Lib.TimeWindow} object is a Javascript Object
 * that stores the current time window.
 * This Object stores a time window and informs widgets or other
 * objects when the time window changes via the 
 * {@link Samotraces.Lib.TimeWindow#event:updateTimeWindow|updateTimeWindow}
 * event.
 * A {@link Samotraces.Lib.TimeWindow|TimeWindow} can be defined in two ways:
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
 * @param {Samotraces.Lib.Timer} opt.timer Timer object, which time
 *     is used to define the middle of the current time window.
 * @param {Number} opt.width Width of the time window.
 *
 */
Samotraces.Lib.TimeWindow = function(opt) {
	// Adding the Observable trait
	Samotraces.Lib.EventHandler.call(this);
	if(opt.start !== undefined && opt.end  !== undefined) {
		this.start = opt.start;
		this.end = opt.end;
		this.__calculate_width();
	} else if (opt.timer !== undefined && opt.width  !== undefined) {
		this.set_width(opt.width,opt.timer.time)
		this.timer = opt.timer;
		this.timer.addEventListener('updateTime',this.updateTime.bind(this));
		this.timer.addEventListener('updateTimePlay',this.updateTime.bind(this));
	} else {
		throw('Samotraces.Lib.TimeWindow error. Arguments could not be parsed.');
	}
};

Samotraces.Lib.TimeWindow.prototype = {
	__calculate_width: function() {
		this.width = this.end - this.start;
	},
	updateTime: function(e) {
		var time = e.data;
		this.set_width(this.width,time);
	},
	/** 
	 * @fires Samotraces.Lib.TimeWindow#updateTimeWindow
	 * @todo Handle correctly the bind to the timer (if this.timer) 
	 */
	set_start: function(time) {
		if(this.start != time) {
			this.start = time;
			this.__calculate_width();
			/**
			 * Time window change event.
			 * @event Samotraces.Lib.TimeWindow#updateTimeWindow
			 * @type {object}
			 * @property {String} type - The type of the event (= "updateTimeWindow").
			 */
			this.trigger('updateTimeWindow');
		}
	},
	/**
	 * @fires Samotraces.Lib.TimeWindow#updateTimeWindow
	 * @todo Handle correctly the bind to the timer (if this.timer) 
	 */
	set_end: function(time) {
		if(this.start != time) {
			this.end = time;
			this.__calculate_width();
			this.trigger('updateTimeWindow');
		}
	},
	get_width: function() {
		return this.width;
	},
	/**
	 * @fires Samotraces.Lib.TimeWindow#updateTimeWindow
	 * @todo Handle correctly the bind to the timer (if this.timer) 
	 */
	set_width: function(width,center) {
		if( center === undefined) {
			center = this.start + this.width/2;
		}
		this.start = center - width/2;
		this.end = center + width/2;
		this.width = width;
		this.trigger('updateTimeWindow');
	},
	/**
	 * @fires Samotraces.Lib.TimeWindow#updateTimeWindow
	 */
	translate: function(delta) {
		if(this.timer) {
			this.timer.set(this.timer.time + delta);
		} else {
			this.start = this.start + delta;
			this.end = this.end + delta;
			this.trigger('updateTimeWindow');
		}
	},
	/** @todo Handle correctly the bind to the timer (if this.timer) */
	zoom: function(coef) {
		this.set_width(this.width*coef);
	},
};


// Check if relevant namespaces exist - or create them.
var Samotraces = Samotraces || {};
Samotraces.Lib = Samotraces.Lib || {};

/**
 * @class
 * Singleton object that detects when the size of the
 * window changes.
 * Widgets that need to update themselves when the size of
 * the window changes should listen to the 'resize' event
 * triggered by the WindowState object.
 * @fires Samotraces.Lib.WindowState#resize
 * @todo fix this... this is not a class
 */
Samotraces.Lib.WindowState = (function() {
	var WS = function() {
		// Addint the Observable trait
		Samotraces.Lib.EventHandler.call(this);
		window.onresize = this.resize.bind(this);
	};
	
	WS.prototype = {
		resize: function() {
			/**
			 * Window resize event.
			 * @event Samotraces.Lib.WindowState#resize
			 * @type {object}
			 * @property {String} type - The type of the event (= "resize").
			 */
			this.trigger('resize'); 
		},
	};

	// WindowState is Observable
	//Samotraces.Objects.Observable.call(WS.prototype);

	return new WS();
})();


// REQUIRES JQUERY

var Samotraces = Samotraces || {};
Samotraces.Tools = Samotraces.Tools || {};

// found there: http://davidwalsh.name/convert-xml-json

// Changes XML to JSON
Samotraces.Tools.xmlToJson = function(xml) {
	
	// Create the return object
	var obj = {};

	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = Samotraces.Tools.xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(Samotraces.Tools.xmlToJson(item));
			}
		}
	}
	return obj;
};

// Check if relevant namespaces exist - or create them.
var Samotraces = Samotraces || {};
Samotraces.Widgets = Samotraces.Widgets || {};

/**
 * @summary Widget for importing a trace from a CSV file.
 * @class Widget for importing a trace from a CSV file.
 * @author Benoît Mathern
 * @constructor
 * @augments Samotraces.Widgets.Widget
 * @see Samotraces.Widgets.Basic.ImportTrace
 * @todo ATTENTION code qui vient d'ailleurs !
 * @description
 * The {@link Samotraces.Widgets.Basic.ImportTrace} widget is a generic
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
 * @param {Samotraces.Lib.Trace} trace
 *     Trace object in which the obsels will be imported.
 */
Samotraces.Widgets.ImportTrace = function(html_id,trace) {
	// WidgetBasicTimeForm is a Widget
	Samotraces.Widgets.Widget.call(this,html_id);

	this.trace = trace;

	this.init_DOM();
};

Samotraces.Widgets.ImportTrace.prototype = {
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
			var time = line.shift();
			var type = line.shift();
			var attributes = {};
			for( var i=0; i < (line.length-1)/2 ; i++) {
				if(line[2*i] != "") {
					attributes[line[2*i]] = line[2*i+1];
				}
			}
		//	console.log('new obsel');
			trace.newObsel(type,time,attributes);
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


// Check if relevant namespaces exist - or create them.
var Samotraces = Samotraces || {};
Samotraces.Widgets = Samotraces.Widgets || {};

/**
 * @summary Widget for visualising an Obsel as an HTML list.
 * @class Widget for visualising an Obsel as an HTML list.
 * @author Benoît Mathern
 * @constructor
 * @mixes Samotraces.Widgets.Widget
 * @description
 * Samotraces.Widgets.ObselInspector is a generic
 * Widget to visualise Obsels.
 * 
 * This widget observes a {@link Samotraces.Lib.ObselSelector|ObselSelector}
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
 * @param {Samotraces.Lib.ObselSelector} obsel_selector
 *     ObselSelector object to observe.
 */
Samotraces.Widgets.ObselInspector = function(html_id,obsel_selector) {
	// WidgetBasicTimeForm is a Widget
	Samotraces.Widgets.Widget.call(this,html_id);
	this.add_class('Widget-ObselInspector');

	this.obsel = obsel_selector;
	this.obsel.addEventListener('obselSelected',this.inspect.bind(this));
	this.obsel.addEventListener('obselUnselected',this.close.bind(this));

	this.init_DOM();
};

Samotraces.Widgets.ObselInspector.prototype = {
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
		li_element.appendChild(document.createTextNode('Id: '+ obs.id));
		this.datalist_element.appendChild(li_element);

		li_element = document.createElement('li');
		li_element.appendChild(document.createTextNode('TimeStamp: '+ obs.timestamp));
		this.datalist_element.appendChild(li_element);

		li_element = document.createElement('li');
		li_element.appendChild(document.createTextNode('Type: '+ obs.type));
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




// Check if relevant namespaces exist - or create them.
var Samotraces = Samotraces || {};
Samotraces.Widgets = Samotraces.Widgets || {};

/**
 * @summary Widget for visualising the current time as a date/time.
 * @class Widget for visualising the current time as a date/tim.
 * @author Benoît Mathern
 * @constructor
 * @mixes Samotraces.Widgets.Widget
 * @see Samotraces.Widgets.TimeForm
 * @description
 * Samotraces.Widgets.ReadableTimeForm is a generic
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
 * @param {Samotraces.Lib.Timer} timer
 *     Timer object to observe.
 */
Samotraces.Widgets.ReadableTimeForm = function(html_id,timer) {
	// WidgetBasicTimeForm is a Widget
	Samotraces.Widgets.Widget.call(this,html_id);

	this.add_class('ReadableTimeForm');

	this.timer = timer;
	this.timer.addEventListener('updateTime',this.refresh.bind(this));
	this.timer.addEventListener('updateTimePlay',this.refresh.bind(this));

	this.init_DOM();
	this.refresh({data: this.timer.time});
};

Samotraces.Widgets.ReadableTimeForm.prototype = {
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



// Check if relevant namespaces exist - or create them.
var Samotraces = Samotraces || {};
Samotraces.Widgets = Samotraces.Widgets || {};

/**
 * @summary Widget for visualising the current time as a number.
 * @class Widget for visualising the current time as a number.
 * @author Benoît Mathern
 * @constructor
 * @mixes Samotraces.Widgets.Widget
 * @see Samotraces.Widgets.ReadableTimeForm
 * @description
 * Samotraces.Widgets.TimeForm is a generic
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
 * @param {Samotraces.Lib.Timer} timer
 *     Timer object to observe.
 */
Samotraces.Widgets.TimeForm = function(html_id,timer) {
	// WidgetBasicTimeForm is a Widget
	Samotraces.Widgets.Widget.call(this,html_id);

	this.timer = timer;
	this.timer.addEventListener('updateTime',this.refresh.bind(this));
	this.timer.addEventListener('updateTimePlay',this.refresh.bind(this));

	this.init_DOM();
	this.refresh({data: this.timer.time});
};

Samotraces.Widgets.TimeForm.prototype = {
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


// Check if relevant namespaces exist - or create them.
var Samotraces = Samotraces || {};
Samotraces.Widgets = Samotraces.Widgets || {};

/**
 * @summary Widget for visualising the current time as a number.
 * @class Widget for visualising the current time as a number.
 * @author Benoît Mathern
 * @constructor
 * @mixes Samotraces.Widgets.Widget
 * @see Samotraces.Widgets.ReadableTimeForm
 * @description
 * Samotraces.Widgets.TimeForm is a generic
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
 * @param {Samotraces.Lib.Timer} timer
 *     Timer object to observe.
 */
Samotraces.Widgets.TimePlayer = function(html_id,timer,videos) {
	// WidgetBasicTimeForm is a Widget
	Samotraces.Widgets.Widget.call(this,html_id);


	var video_ids = videos || [];

	this.videos = video_ids.map(function(v) {
		if(v.youtube) {
			return Popcorn.youtube('#'+v.id,v.youtube);
		} else if(v.vimeo) {
			return Popcorn.vimeo('#'+v.id,v.youtube);
		} else {
			return Popcorn('#'+v.id);
		}
	});

	this.timer = timer;
	this.timer.addEventListener('updateTime',this.onUpdateTime.bind(this));
	this.timer.addEventListener('play',this.onPlay.bind(this));
	this.timer.addEventListener('pause',this.onPause.bind(this));


	this.init_DOM();
	this.onUpdateTime({data: this.timer.time});
};

Samotraces.Widgets.TimePlayer.prototype = {
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


// Check if relevant namespaces exist - or create them.
var Samotraces = Samotraces || {};
Samotraces.Widgets = Samotraces.Widgets || {};

/**
 * @summary Widget for visualising a time slider.
 * @class Widget for visualising a time slider.
 * @author Benoît Mathern
 * @constructor
 * @mixes Samotraces.Widgets.Widget
 * @description
 * Samotraces.Widgets.d3Basic.TimeSlider is a generic
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
Samotraces.Widgets.TimeSlider = function(html_id,time_window,timer) {
	// WidgetBasicTimeForm is a Widget
	Samotraces.Widgets.Widget.call(this,html_id);

	this.add_class('Widget-TimeSlider');
	Samotraces.Lib.WindowState.addEventListener('resize',this.draw.bind(this));

	this.timer = timer;
	this.timer.addEventListener('updateTime',this.draw.bind(this));
	this.timer.addEventListener('updateTimePlay',this.refresh.bind(this));

	this.time_window = time_window;
	this.time_window.addEventListener('updateTimeWindow',this.draw.bind(this));

	// update slider style
	this.slider_offset = 0;

	this.init_DOM();
	// update slider's position
	this.draw();

};

Samotraces.Widgets.TimeSlider.prototype = {
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



// Check if relevant namespaces exist - or create them.
var Samotraces = Samotraces || {};
Samotraces.Widgets = Samotraces.Widgets || {};

/**
 * @summary Widget for visualising a trace where obsels are displayed as images.
 * @class Widget for visualising a trace where obsels are displayed as images
 * @author Benoît Mathern
 * @requires d3.js framework (see <a href="http://d3js.org">d3js.org</a>)
 * @constructor
 * @mixes Samotraces.Widgets.Widget
 * @fires Samotraces.Widgets.TraceDisplayIcons#ui:click:obsel
 * @description
 * The {@link Samotraces.Widgets.TraceDisplayIcons|TraceDisplayIcons} widget
 * is a generic
 * Widget to visualise traces with images. This widget uses 
 * d3.js to display traces as images in a SVG image.
 * The default settings are set up to visualise 16x16 pixels
 * icons. If no url is defined (see options), a questionmark 
 * icon will be displayed by default for each obsel.
 *
 * Note that clicking on an obsel will trigger a 
 * {@link Samotraces.Widgets.TraceDisplayIcons#ui:click:obsel|ui:click:obsel}
 * event.
 *
 * Tutorials {@tutorial tuto1.1_trace_visualisation},
 * {@tutorial tuto1.2_adding_widgets}, and 
 * {@tutorial tuto1.3_visualisation_personalisation} illustrates
 * in more details how to use this class.
 * @param {String}	divId
 *     Id of the DIV element where the widget will be
 *     instantiated
 * @param {Samotraces.Lib.Trace}	trace
 *     Trace object to display
 * @param {Samotraces.Lib.TimeWindow} time_window
 *     TimeWindow object that defines the time frame
 *     being currently displayed.
 *
 * @param {Object} [options]
 *     Parameter that specifies the visualisation options and
 *     default event handling.
 * @param {Samotraces.Widgets.TraceDisplayIcons.VisuConfig} [options.visu]
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
 *     link Samotraces.Widgets.TraceDisplayIcons.calculate_x}
 *     See tutorial 
 *     {@tutorial tuto1.3_visualisation_personalisation}
 *     for more details and examples.
 * @param {Samotraces.Widgets.EventConfig}	[options.events]
 *     Url of the image to display (default: a 
 *     questionmark dataurl)
 *
 * @example
 * var options = {
 *     visu: {
 *         y: 20,
 *         width: 32,
 *         height: 32,
 *         url: function(obsel) {
 *             switch(obsel.type) {
 *                 case 'click':
 *                     return 'images/click.png';
 *                 case 'focus':
 *                     return 'images/focus.png';
 *                 default:
 *                     return 'images/default.png';
 *             }
 *         }
 *     },
 *     events: {
 *         'ui:click:obsel': obsel_selector.select.bind(obsel_selector)
 *     }
 * };
 */
Samotraces.Widgets.TraceDisplayIcons = function(divId,trace,time_window,options) {

	// WidgetBasicTimeForm is a Widget
	Samotraces.Widgets.Widget.call(this,divId);

	this.add_class('Widget-TraceDisplayIcons');
	Samotraces.Lib.WindowState.addEventListener('resize',this.refresh_x.bind(this));

	this.trace = trace;
	this.trace.addEventListener('updateTrace',this.draw.bind(this));
	this.trace.addEventListener('newObsel',this.addObsel.bind(this));

	this.window = time_window;
	this.window.addEventListener('updateTimeWindow',this.refresh_x.bind(this));

//	this.obsel_selector = obsel_selector;
//	this.window.addEventListener('',this..bind(this));

	this.init_DOM();
	this.data = this.trace.traceSet;


	this.options = {};
	options = options || {};
	options.visu = options.visu || {};
	options.events = options.events || {};

	Samotraces.Lib.EventHandler.call(this);
	this.parse_events(options.events);

	/**
	 * @typedef Samotraces.Widgets.TraceDisplayIcons.VisuConfig
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
	 * link Samotraces.Widgets.TraceDisplayIcons.calculate_x}
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
	this.options.x = bind_function(options.visu.x || function(o) {
			return this.calculate_x(o.timestamp) - 8;
		});
	this.options.y = bind_function(options.visu.y || 17);
	this.options.width = bind_function(options.visu.width || 16);
	this.options.height = bind_function(options.visu.height || 16);
	this.options.url = bind_function(options.visu.url || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAG7AAABuwBHnU4NQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAKsSURBVDiNrZNLaFNpFMd/33fvTa5tYpuq0yatFWugRhEXw9AuhJEZBCkiqJWCIErrxp241C6L6650M/WBowunoyCDCjKrGYZ0IbiwxkdUbGyaPmgSm8d9f25MbXUlzH95zv/8OOdwjlBKsVajU1kEtJiavNBsaKcBqq5/3fKDSwrKY33JdX7RAIxOZQGM3bHIymCyPZhZqT8p2d4sQGtY7+yObvhxMjsvp4uVKOA2QEIpxehUFl2IvuFUZ3rZcu/+9X7RWqg7Jxw/QAFhTdLRFJoY6N4SazONo1czs/2eUlNjfUn0Risne+Pp9yv18TvZwrl9iVb2J2JEQhoKKNke6UJ55LfMB4aSHeMne+Ppay/yAkBcTL9ma7Np7Yu3/n1lOjdQ8wLO793GzlgzFdcjYujoUpAt17j8LIfjB5zdvfXBv3OlX3NVy5SAOJVKhP94M29UXB8FFGoWE89nufTkHQ9nFlEKejZuoLe1iYrr8+fbee9UKhEGhB6SYrBoudPLtnsAQCnF768Kq1v2AxAC6l7AsuUCsGS5h4uWOx2SYlBqQoyUHW/O9gO+1i9dbfyciKGA/wol3pTrANh+QNnx5jQhRuQ3VZ+1Z1OUg92biZkG/+SL3Hu7gPfVzQBIX6mJlpAeD2vrWds3mth+wOtSlUczS1RdfzUX1iQtIT3uKzWhO4GajJnGnc2mcf+j4x1umJ4uVShUbRSwUHPWwdvCxuOYaRxwAjUpAXUjk7eP9bTrEUNbNf30Q5ThXV0c6WknGvoSjxgax3e0uzcyeRtQcqwvSa5qmaYuB4aSHeMNiEJgahJ9zWQRQ2Mo2TFu6nIgV7XMdZd48+Vc/3CqM30m1XX3wcxi8d3H2sitl3mUACkEyZam24e2bTHbTOPc1cxsf6Pu/3mmtfred/4ESQNKXG8VACoAAAAASUVORK5CYII=');

	this.draw();
};

Samotraces.Widgets.TraceDisplayIcons.prototype = {
	init_DOM: function() {
		var div_elmt = d3.select('#'+this.id);
		this.svg = div_elmt.append('svg');

		// create the (red) line representing current time
		this.svg.append('line')
			.attr('x1','50%')
			.attr('y1','0%')
			.attr('x2','50%')
			.attr('y2','100%')
			.attr('stroke-width','1px')
			.attr('stroke','red')
			.attr('opacity','0.3');
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
					widget.window.translate(time_delta);	
				//	var new_time = widget.timer.time - delta_x*widget.window.get_width()/widget.element.clientWidth;
					// replace element.getSize() by element.clientWidth?
					widget.svg_gp.attr('transform','translate(0,0)');
				//	widget.timer.set(new_time);
					
				},
				onMoveCallback: function(offset) {
					widget.svg_gp.attr('transform','translate('+offset+',0)');
				},
			});
		this.add_behaviour('zommOnScroll',this.element,{timeWindow: this.window});
//		this.element.addEventListener('wheel',this.build_callback('wheel'));
//		this.element.addEventListener('mousedown',this.build_callback('mousedown'));
	},


	// TODO: needs to be named following a convention 
	// to be decided on
	/**
	 * Calculates the X position in pixels corresponding to 
	 * the time given in parameter.
	 * @param {Number} time Time for which to seek the corresponding x parameter
	 */
	calculate_x: function(time) {
//console.log(time);
		var x = (time - this.window.start)*this.element.clientWidth/this.window.get_width();
//console.log(x);
		return x;
	},

	refresh_x: function() {
		this.d3Obsels()
			.attr('x',this.options.x)
			.attr('y',this.options.y);
	},
/*	translate_x: function() {
		this.time
		var delta_x = this.timer.time - 
var new_time = widget.timer.time - delta_x*widget.window.get_width()/widget.element.clientWidth;
		this.current_offset = this.current_offset + offset;
		this.svg_gp.attr('transform','translate('+this.current_offset+',0)');
	},*/

	draw: function(e) {
		if(e) {
			this.data = this.trace.traceSet;
		}
		function clickOnObsel(obs) {
			/**
			 * @event Samotraces.Widgets.TraceDisplayIcons#ui:click:obsel
			 * @type {object}
			 * @property {String} type - The type of the event (= "ui:click:obsel").
			 * @property {Samotraces.Lib.Obsel} data - The obsel that
			 *     has been the target of the click.
			 */
			this.trigger('ui:click:obsel',obs);
		}
		this.d3Obsels()
			.enter()
			.append('image')
			.attr('x',this.options.x)
			.attr('y',this.options.y)
			.attr('width',this.options.width)
			.attr('height',this.options.height)
			.attr('xlink:href',this.options.url)
			// why not direcly here !?
			.on('click',clickOnObsel.bind(this));
//		this.updateEventListener();
	},
	drawObsel: function(obs) {
		this.draw();	
	},

	addObsel: function(e) {
		var obs = e.data;
//console.log('addObsel '+obs.id);
//console.log(obs);
		this.data.push(obs);
		this.drawObsel(obs);
		this.updateEventListener();
	},
	d3Obsels: function() {
		return this.svg_gp
					.selectAll('circle,image,rect')
					// TODO: ATTENTION! WARNING! obsels MUST have a field id -> used as a key.
					.data(this.data); //,function(d) { return d.id;});
	},


};







// Check if relevant namespaces exist - or create them.
var Samotraces = Samotraces || {};
Samotraces.Widgets = Samotraces.Widgets || {};

/**
 * @summary Widget for visualising a trace.
 * @class Widget for visualising a trace.
 * @author Benoît Mathern
 * @requires d3.js framework (see <a href="http://d3js.org">d3js.org</a>)
 * @constructor
 * @mixes Samotraces.Widgets.Widget
 * @description
 * DESCRIPTION TO COME....
 * @param {String}	divId
 *     Id of the DIV element where the widget will be
 *     instantiated
 * @param {Samotraces.Lib.Trace}	trace
 *     Trace object to display
 * @param {Samotraces.Lib.TimeWindow} time_window
 *     TimeWindow object that defines the time frame
 *     being currently displayed.
 * @todo add description and update doc...
 */
Samotraces.Widgets.TraceDisplayObselOccurrences = function(divId,trace,time_window) {

	// WidgetBasicTimeForm is a Widget
	Samotraces.Widgets.Widget.call(this,divId);

	this.add_class('WidgetTraceDisplayObselOccurrences');
	Samotraces.Lib.WindowState.addEventListener('resize',this.refresh_x.bind(this));

	this.trace = trace;
	this.trace.addEventListener('updateTrace',this.draw.bind(this));
	this.trace.addEventListener('newObsel',this.addObsel.bind(this));

	this.window = time_window;
	this.window.addEventListener('updateTimeWindow',this.refresh_x.bind(this));


	this.init_DOM();
	this.data = this.trace.traceSet;

	this.draw();
};

Samotraces.Widgets.TraceDisplayObselOccurrences.prototype = {
	init_DOM: function() {
		var div_elmt = d3.select('#'+this.id);
		this.svg = div_elmt.append('svg');


		this.svg_gp = this.svg.append('g')
						.attr('transform', 'translate(0,0)');

		// event listeners
		var widget = this;
		this.add_behaviour('changeTimeOnDrag',this.element,{
				onUpCallback: function(delta_x) {
					var time_delta = -delta_x*widget.window.get_width()/widget.element.clientWidth;
					widget.window.translate(time_delta);	
				//	var new_time = widget.timer.time - delta_x*widget.window.get_width()/widget.element.clientWidth;
					// replace element.getSize() by element.clientWidth?
					widget.svg_gp.attr('transform','translate(0,0)');
				//	widget.timer.set(new_time);
					
				},
				onMoveCallback: function(offset) {
					widget.svg_gp.attr('transform','translate('+offset+',0)');
				},
			});
		this.add_behaviour('zommOnScroll',this.element,{timeWindow: this.window});
//		this.element.addEventListener('wheel',this.build_callback('wheel'));
//		this.element.addEventListener('mousedown',this.build_callback('mousedown'));
	},


	// TODO: needs to be named following a convention 
	// to be decided on
	/**
	 * Calculates the X position in pixels corresponding to 
	 * the time given in parameter.
	 * @param {Number} time Time for which to seek the corresponding x parameter
	 */
	calculate_x: function(o) {
//console.log(o);
		var x = (o.attributes.hasBegin - this.window.start)*this.element.clientWidth/this.window.get_width();
//console.log(x);
		return x;
	},

	refresh_x: function() {
		this.d3Obsels()
			.attr('x1',this.calculate_x.bind(this))
			.attr('x2',this.calculate_x.bind(this));
	},
/*	translate_x: function() {
		this.time
		var delta_x = this.timer.time - 
var new_time = widget.timer.time - delta_x*widget.window.get_width()/widget.element.clientWidth;
		this.current_offset = this.current_offset + offset;
		this.svg_gp.attr('transform','translate('+this.current_offset+',0)');
	},*/

	draw: function(e) {
		if(e) {
			this.data = this.trace.traceSet;
		}
		this.d3Obsels()
			.enter()
			.append('line')
			.attr('x1',this.calculate_x.bind(this))
			.attr('y1','0%')
			.attr('x2',this.calculate_x.bind(this))
			.attr('y2','100%')
			.attr('stroke-width','1px')
			.attr('stroke','black');
	},
	drawObsel: function(obs) {
		this.draw();	
	},

	addObsel: function(e) {
		var obs = e.data;
//console.log('addObsel '+obs.id);
//console.log(obs);
		this.data.push(obs);
		this.drawObsel(obs);
	},
	d3Obsels: function() {
		return this.svg_gp
					.selectAll('line')
					// TODO: ATTENTION! WARNING! obsels MUST have a field id -> used as a key.
					.data(this.data); //,function(d) { return d.id;});
	},


};







// Check if relevant namespaces exist - or create them.
var Samotraces = Samotraces || {};
Samotraces.Widgets = Samotraces.Widgets || {};

/**
 * @summary Widget for visualising the current time as a number.
 * @class Widget for visualising the current time as a number.
 * @author Benoît Mathern
 * @constructor
 * @mixes Samotraces.Widgets.Widget
 * @see Samotraces.Widgets.ReadableTimeForm
 * @description
 * Samotraces.Widgets.TimeForm is a generic
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
 * @param {Samotraces.Lib.Timer} timer
 *     Timer object to observe.
 */
Samotraces.Widgets.VideoSynchroniser = function(html_id,video_id,timer,master) {
	// WidgetBasicTimeForm is a Widget
	Samotraces.Widgets.Widget.call(this,html_id);

	this.timer = timer;	
	this.video = Popcorn('#'+video_id);
//console.log(this.video.play());
	if(master=='timer') {
		this.timer.addEventListener('updateTime',this.updateVideoTime.bind(this));
	} else {
		this.video.on('timeupdate',this.updateTimerTime.bind(this));
	}
};

Samotraces.Widgets.VideoSynchroniser.prototype = {

	updateVideoTime: function(e) {
		this.video.currentTime(e.data);
	},
	updateTimerTime: function() {
		this.timer.set(this.video.currentTime());
	},

};


// Check if relevant namespaces exist - or create them.
var Samotraces = Samotraces || {};
Samotraces.Widgets = Samotraces.Widgets || {};


/**
 * @mixin
 * @description
 * All widgets should inherit from this Samotraces.Widgets.Widget.
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
Samotraces.Widgets.Widget = (function() {
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

	function parse_events(events) {
		/**
		 * The EventConfig object is used for configurating the
		 * functions to call events are triggered by a Widget.
		 * Each attribute name of the EventConfig corresponds
		 * to a type of event listened to, and each
		 * value is the function to trigger on this event.
		 * @typedef Samotraces.Widgets.EventConfig
		 * @type {Object.<string, function>}
		 * @property {function} eventName - Function to trigger on this event.
		 */
		for(var event_name in events) {
			var fun = events[event_name];
			this.addEventListener(event_name,function(e) { fun(e.data); });
		}
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
					var coef = Math.pow(0.8,-e.deltaY/3);
					opt.timeWindow.zoom(coef);
	//				opt.onWheelCallback.call(opt.bind,coef);
					e.preventDefault();
					return false;
				};
				eventTargetElement.addEventListener('wheel',wheel);
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
		this.parse_events = parse_events;

		// call method
		this.add_class('Widget');
		return this;
	};
})();


// Check if relevant namespaces exist - or create them.
var Samotraces = Samotraces || {};
Samotraces.Widgets = Samotraces.Widgets || {};

/**
 * @summary Widget for visualising a time scale.
 * @class Widget for visualising a time scale.
 * @author Benoît Mathern
 * @requires d3.js framework (see <a href="http://d3js.org">d3js.org</a>)
 * @constructor
 * @mixes Samotraces.Widgets.Widget
 * @description
 * Samotraces.Widgets.WindowScale is a generic
 * Widget to visualise the temporal scale of a 
 * {@link Samotraces.Lib.TimeWindow|TimeWindow}. This
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
Samotraces.Widgets.WindowScale = function(html_id,time_window,is_javascript_date) {
	// WidgetBasicTimeForm is a Widget
	Samotraces.Widgets.Widget.call(this,html_id);

	this.add_class('Widget-WindowScale');
	Samotraces.Lib.WindowState.addEventListener('resize',this.draw.bind(this));

	this.window = time_window;
//	time_window.addObserver(this);
	this.window.addEventListener('updateTimeWindow',this.draw.bind(this));

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

Samotraces.Widgets.WindowScale.prototype = {
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



// Check if relevant namespaces exist - or create them.
var Samotraces = Samotraces || {};
Samotraces.Widgets = Samotraces.Widgets || {};

/**
 * @summary Widget for visualising a window slider.
 * @class Widget for visualising a window slider.
 * @author Benoît Mathern
 * @constructor
 * @mixes Samotraces.Widgets.Widget
 * @description
 * Samotraces.Widgets.d3Basic.WindowSlider is a generic
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
Samotraces.Widgets.WindowSlider = function(html_id,wide_window,slider_window) {
	// WidgetBasicTimeForm is a Widget
	Samotraces.Widgets.Widget.call(this,html_id);

	this.add_class('Widget-WindowSlider');
	Samotraces.Lib.WindowState.addEventListener('resize',this.draw.bind(this));

	this.wide_window = wide_window;
	this.wide_window.addEventListener('updateTimeWindow',this.draw.bind(this));
	this.slider_window = slider_window;
	this.slider_window.addEventListener('updateTimeWindow',this.draw.bind(this));

	this.slider_offset = 0;
	this.width = 0;

	this.init_DOM();
	// update slider's position
	this.draw();
};

Samotraces.Widgets.WindowSlider.prototype = {
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



// Check if relevant namespaces exist - or create them.
var Samotraces = Samotraces || {};
Samotraces.Widgets = Samotraces.Widgets || {};
Samotraces.Widgets.ktbs = Samotraces.Widgets.ktbs || {};

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
 * @param {Samotraces.Objects.Ktbs} ktbs
 *     Ktbs to bind to.
 */
Samotraces.Widgets.ktbs.ListBases = function(html_id,ktbs) {
	// WidgetBasicTimeForm is a Widget
	Samotraces.Widgets.Widget.call(this,html_id);
	Samotraces.Lib.EventHandler.call(this);
	this.add_class('WidgetListBases');

	this.ktbs = ktbs;
	ktbs.addEventListener('updated',this.refresh.bind(this));

	this.init_DOM();
};

Samotraces.Widgets.ktbs.ListBases.prototype = {
	init_DOM: function() {
		this.element.innerHTML = "";

		var title = document.createElement('h2');
		var title_text = document.createTextNode('Ktbs root: '+this.ktbs.get_uri());
		title.appendChild(title_text);
		this.element.appendChild(title);

		this.datalist_element = document.createElement('ul');
		this.element.appendChild(this.datalist_element);

	},
	refresh: function() {
		// clear
		this.datalist_element.innerHTML = '';
		var li_element;
		this.ktbs.list_bases().forEach(function(b) {
				li_element = document.createElement('li');
				li_element.appendChild(document.createTextNode(b));
				li_element.addEventListener('click',(function() {this.trigger('selected_base',b)}).bind(this));
				this.datalist_element.appendChild(li_element);
			},this);

	},
};




// Check if relevant namespaces exist - or create them.
var Samotraces = Samotraces || {};
Samotraces.Widgets = Samotraces.Widgets || {};
Samotraces.Widgets.ktbs = Samotraces.Widgets.ktbs || {};

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
 * @param {Samotraces.Objects.Ktbs} ktbs
 *     Ktbs to bind to.
 */
Samotraces.Widgets.ktbs.ListTracesInBases = function(html_id,ktbs_base) {
	// WidgetBasicTimeForm is a Widget
	Samotraces.Widgets.Widget.call(this,html_id);
	Samotraces.Lib.EventHandler.call(this);
	this.add_class('WidgetListBases');

	this.base = ktbs_base;
	this.base.addEventListener('updated',this.refresh.bind(this));

	this.init_DOM();
};

Samotraces.Widgets.ktbs.ListTracesInBases.prototype = {
	init_DOM: function() {
		this.element.innerHTML = "";

		var title = document.createElement('h2');
		var title_text = document.createTextNode('Base: '+this.base.get_uri());
		title.appendChild(title_text);
		this.element.appendChild(title);

		this.datalist_element = document.createElement('ul');
		this.element.appendChild(this.datalist_element);

	},
	refresh: function() {
		// clear
console.log('refresh');
		this.datalist_element.innerHTML = '';
		var li_element;
		this.base.list_traces().forEach(function(t) {
				li_element = document.createElement('li');
				li_element.appendChild(document.createTextNode(t['@id']));
				li_element.addEventListener('click',(function() {this.trigger('selected_trace',t['@id'])}).bind(this));
				this.datalist_element.appendChild(li_element);
			},this);

	},
};


