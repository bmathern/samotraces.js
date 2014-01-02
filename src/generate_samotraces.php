
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

/*
echo(file_get_contents('Lib/EventHandler.js'));
echo(file_get_contents('Lib/Collecteur.js'));
echo(file_get_contents('Lib/addBehaviour.js'));
echo(file_get_contents('Lib/Obsel.js'));
echo(file_get_contents('Lib/Selector.js'));
echo(file_get_contents('Lib/DemoTrace.js'));
echo(file_get_contents('Lib/KtbsTrace.js'));
echo(file_get_contents('Lib/KtbsBogueTrace.js'));
echo(file_get_contents('Lib/Ktbs4jsTrace.js'));
echo(file_get_contents('Lib/KtbsBase.js'));
echo(file_get_contents('Lib/Ktbs.js'));
echo(file_get_contents('Lib/Timer.js'));
echo(file_get_contents('Lib/SelfUpdatingTimer.js'));
echo(file_get_contents('Lib/TimeWindow.js'));
echo(file_get_contents('Lib/WindowState.js'));
*/
export_all_js('Lib/');
export_all_js('Widgets/');
export_all_js('UIComponents/');

?>
	return Σ;
})();
