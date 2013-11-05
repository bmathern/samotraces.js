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


echo(file_get_contents('Objects/ObserverObservable.js'));
echo(file_get_contents('Objects/EventBuilder.js'));
echo(file_get_contents('Objects/Obsel.js'));
echo(file_get_contents('Objects/ObselSelector.js'));
echo(file_get_contents('Objects/DemoTrace.js'));
echo(file_get_contents('Objects/KtbsTrace.js'));
echo(file_get_contents('Objects/KtbsBogueTrace.js'));
echo(file_get_contents('Objects/Ktbs4jsTrace.js'));
echo(file_get_contents('Objects/KtbsBase.js'));
echo(file_get_contents('Objects/Ktbs.js'));
echo(file_get_contents('Objects/Timer.js'));
echo(file_get_contents('Objects/SelfUpdatingTimer.js'));
echo(file_get_contents('Objects/TimeWindow.js'));
echo(file_get_contents('Objects/TimeWindowCenteredOnTime.js'));
echo(file_get_contents('Objects/WindowState.js'));

export_all_js('Tools/');
export_all_js('Widgets/');
export_all_js('Collecte/');


/* // AUTOMATED VERSION... doesn't respect necessary order
// adapted from http://fr.php.net/manual/en/function.glob.php

$dir = '.';
do {
	foreach (glob($dir."/*.js") as $filename) {
    	echo(file_get_contents($filename));
	}
	$dir .= '/*';
} while($dirs = glob($dir, GLOB_ONLYDIR));
// */

?>
