<?php

// this script can be copied and pasted in any folder
// calling this script will concatenate all the .js file contained
// in that folder.

foreach (glob("*.js") as $filename) {
    echo(file_get_contents($filename));
}

?>
