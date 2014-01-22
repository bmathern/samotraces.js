
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
	 * @namespace Samotraces
	 */
	Σ = {};
	var Samotraces = Σ;
	/**
	 * @property {Boolean} [debug=false]
	 */
	Σ.debug = false;

	/**
	 * Library of the Objects of Samotraces
	 * @namespace Samotraces.Lib
	 */
	Σ.Lib = {};
	Σ.UIComponents = {};
	/**
	 * Set of Widgets of Samotraces
	 * @namespace Samotraces.Widgets
	 */
	Σ.Widgets = {};

	// ALL SRC FILES INCLUDED HERE --- SEE PHP	

	return Samotraces;
}));
