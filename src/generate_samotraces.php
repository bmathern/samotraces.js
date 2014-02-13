
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
	/**
	 * Library of UI components for Samotraces
	 * @namespace Samotraces.UIComponents
	 */
	Σ.UIComponents = {};
	/**
	 * Set of Widgets of Samotraces
	 * @namespace Samotraces.Widgets
	 */
	Σ.Widgets = {};
	
<?php

header("Content-Disposition: attachment; filename=\"Samotraces.js\"");

function export_all_js($dir) {
do {
	foreach (glob($dir."/*.js") as $filename) {
    	echo(file_get_contents($filename));
	}
	$dir .= '/*';
} while($dirs = glob($dir, GLOB_ONLYDIR));
} 

export_all_js('Lib/');
export_all_js('Widgets/');
export_all_js('UIComponents/');

?>
	return Samotraces;
}));
