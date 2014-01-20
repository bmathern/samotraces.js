
var Samotraces = (function() {
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
	return Σ;
})();
