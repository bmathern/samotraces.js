<?php

// adapted from http://fr.php.net/manual/en/function.glob.php

$dir = '.';
do {
	foreach (glob($dir."/*.js") as $filename) {
    	echo(file_get_contents($filename));
	}
	$dir .= '/*';
} while($dirs = glob($dir, GLOB_ONLYDIR));


?>
