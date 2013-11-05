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

