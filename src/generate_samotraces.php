
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
	debug_mode = false;

	/**
	 * Library of the Objects of Samotraces
	 * @namespace Samotraces.Lib
	 */
	Samotraces.Lib = {};
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
			var class_name = (this!==undefined)?[this.constructor.name]:[];
            window.console.log.apply(console, [ "Samotraces.js" ].concat(class_name,[].slice.call(arguments)));
		}
	};
	Samotraces.debug = function debug() {
		if(debug_mode && window.console) {
			var class_name = (this!==undefined)?[this.constructor.name]:[];
            window.console.log.apply(console, [ "Samotraces.js-debug" ].concat(class_name,[].slice.call(arguments)));
		}
	};
	
<?php

header("Content-Disposition: attachment; filename=\"Samotraces.js\"");

function export_all_js($dir,$priority_list) {
$first = "";
$last = "";
do {
	foreach (glob($dir."/*.js") as $filename) {
		if(in_array($filename,$priority_list)) {
$first .= "\n// first: $filename\n";
			$first .= file_get_contents($filename);
		} else {
$last .= "\n// last: $filename\n";
			$last .= file_get_contents($filename);
		}
	}
	$dir .= '/*';
} while($dirs = glob($dir, GLOB_ONLYDIR));
echo($first.$last);
} 

export_all_js('core',['core/Obsel.js']);
export_all_js('UI');
//export_all_js('UIComponents/');

?>
	return Samotraces;
}));
