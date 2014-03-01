
(function(factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define('samotraces',['jquery'], factory);
    } else {
        // Browser globals
        window.Samotraces = factory(jQuery);
    }
}(function ($) {
	/**
	 * Library of the Objects of Samotraces
	 * @namespace Samotraces
	 */
	var Samotraces = {};
	/**
	 * @property {Boolean} [debug=false]
	 */
	var debug_mode = false;
	Samotraces.set_debug = function(val) { debug_mode = val; };

	/**
	 * Library of UI components for Samotraces
	 * @namespace Samotraces.UI
	 */
	Samotraces.UI = {};
	/**
	 * Set of Widgets of Samotraces
	 * @namespace Samotraces.UI.Widgets
	 */
	Samotraces.UI.Widgets = {};

	Samotraces.log = function log() {
		if(window.console) {
            window.console.log.apply(console, [ "Samotraces.js" ].concat([].slice.call(arguments)));
		}
	};
	Samotraces.debug = function debug() {
		if(debug_mode && window.console) {
            window.console.log.apply(console, [ "Samotraces.js-debug" ].concat([].slice.call(arguments)));
		}
	};
	
	// ALL SRC FILES INCLUDED HERE --- SEE PHP

	return Samotraces;
}));
