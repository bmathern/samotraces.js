
// REQUIRES JQUERY

// Check if relevant namespaces exist - or create them.
var Samotraces = Samotraces || {};
Samotraces.Objects = Samotraces.Objects || {};

/**
 * @class Javascript Trace Object that is bound to a KTBS trace. 
 * @author Benoît Mathern
 * @requires jQuery framework (see <a href="http://jquery.com">jquery.com</a>)
 * @requires ktbs4js (see <a href="https://github.com/oaubert/ktbs4js">on github</a>)
 * @constructor
 * @augments Samotraces.Objects.Observable
 * @description
 * Samotraces.Objects.Ktbs4jsTrace is a Javascript Trace object
 * that is bound to a KTBS trace. This Object wraps the 
 * ktbs4js API to the KTBS to make it compatible with the
 * Samotraces framework.
 *
 * @param {String}	url	Url of the KTBS trace to load.
 */
Samotraces.Objects.Ktbs4jsTrace = function(url) {
	this.trace = tracemanager.init_trace('trace1',{url: url, syncmode: 'sync', format: 'turtle'});
	this.traceSet = this.trace.obsels;
	$(this.trace).on('updated',this.onUpdate.bind(this));
	this.trace.force_state_refresh();
};

Samotraces.Objects.Ktbs4jsTrace.prototype = {
	onUpdate: function() {
		this.traceSet = this.trace.obsels;
		this.notify('updateTrace',this.obsels);
	},
	newObsel: function(type,timeStamp,attributes) {
		this.trace.trace(type,attributes,timeStamp);
	},

};

// Trace is Observable
Samotraces.Objects.Observable.call(Samotraces.Objects.Ktbs4jsTrace.prototype);


