
//document.domain = 'localhost';

function init() {

	// Samotraces is called Σ for short
	var Σ = Samotraces;


	/*
     * Creation of the logical objects
     */

	// Create a Trace Object (gets the URL of the KTBS trace
	// from the form.
	var url_trace 	= 'http://127.0.0.1/ktbs/base-analyste-test/t01/';
	var trace 			= new Σ.Lib.KtbsBogueTrace(url_trace);

	// currently selected obsel
	var current_obsel	= new Σ.Lib.ObselSelector();
	
	// timer observable (describes current visualisation time)
	var timer 			= new Σ.Lib.Timer(Date.now());
//	var timer 			= new Σ.Lib.SelfUpdatingTimer();

	var hour = 3600*1000;
	// time window of the second set of widgets (small time window)
	var tw_hour		= new Σ.Lib.TimeWindow({timer:timer,width:hour});


	/*
     * Creation of the Widgets
     */

	// visualisation options for the TraceDisplayIcons Widget
	var visu_options = {
		x: function(o) {
			return this.calculate_x(o.attributes.hasBegin) - 8; 
		},	// */
		url: function(o) {			
			switch(o.type) {
				case 'click':
					if(o.attributes['ns1:DOM_tagName'] == 'A') {
						return 'images/icons/link_go.png';
					} else if(o.attributes['ns1:DOM_tagName'] == 'INPUT' 
							&& o.attributes['ns1:DOM_type'] == 'submit') {
						return 'images/icons/link_go.png';
					} else {
						return 'images/icons/cursor.png';
					}
				case 'focus':
					return 'images/icons/resultset_next.png';
				case 'change':
					if(o.attributes['ns1:DOM_tagName'] == 'INPUT' 
						&& o.attributes['ns1:DOM_type'] == 'text') {
						return 'images/icons/textfield_rename.png';
					} else {
						return 'images/icons/pencil.png';
					}
				default:
					return 'images/icons/help.png';
			}
		},
	};

	// Widgets linked to the wide time window
	// Trace visualisation Widget
	new Σ.Widgets.TraceDisplayIcons('trace',trace,current_obsel,tw_hour,visu_options);
	// Scale
	new Σ.Widgets.WindowScale('scale',tw_hour);


	// Misc. widgets
	// Widget that displays a time form
	new Σ.Widgets.ReadableTimeForm('time_form',timer);
	// Obsel inspector
	new Σ.Widgets.ObselInspector('obselinspector',current_obsel);


	/*
     * Collection of events
     */

	// function used to "log" the events when cought
	// this function is used as a callback to the 
	// event listeners.
	var event_tracer = function(event) {
		/* TODO: Robustifier avec un try-catch...
		 * de cette manière, une erreur dans le programme
		 * ne fait pas planter toute la capture de l'obsel
		 * seulement une partie des infos sont manquantes...
		 * try {}
		 * catch(error) {}	
		 */

		var type = event.type;
		var timestamp = (new Date).getTime();
		var attributes = {
			// TROUVER UN MOYEN DE CONNAITRE L'URL DE L'IFRAME EN JQUERY?
			// document.getElementById('iframe').contentWindow.location.href
			// $('#iframe').?
			URI: document.getElementById('iframe').contentWindow.location.href,
			DOM_tagName: event.target.tagName,
		};
		if( event.target.id ) {
			target_elmnt = d3.select('#iframe').contents().find('#'+event.target.id);
			attributes.OutputValue = target_elmnt.val();
		}
		attributes.DOM_type = event.target.type;
		attributes.DOM_value = event.target.value;
		attributes.DOM_checked = event.target.checked;

		trace.newObsel(type,timestamp,attributes);
		timer.set(Date.now());

	};

	// function that init the event listeners in the iframe
	var init_iframe = function() {
		var collecteur = new Samotraces.Lib.Collecteur();
		collecteur.addIFrameEspion('click,change','input,a,div,img,select',event_tracer,trace,'iframe');
		collecteur.start();
	};

	// Make sure the iframe listeners are refreshed
	// whenever the iframe is loaded
	document.getElementById('iframe').addEventListener('load',init_iframe);

	// Init the form behaviour -> updating the URL will make
	// the iframe load this new url.
	document.getElementById('iframe_url_form').addEventListener('submit',function(e) {
		e.preventDefault();
		document.getElementById('iframe').src = document.getElementById('iframe_url').value;
		return false;
	});

}

// run the previous code when all the page has been properly loaded.
window.addEventListener('DOMContentLoaded', init );







