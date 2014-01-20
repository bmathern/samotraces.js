###Installation

First, install jsdoc3 on your computer:
[https://github.com/jsdoc3/jsdoc](https://github.com/jsdoc3/jsdoc)

Then, clone the docstrap template adapted for Samotraces.js:

    git clone https://github.com/bmathern/docstrap PATH-TO-DOCSTRAP


###Running the documentation

Run the following command to generate the doc from the root of your Samotraces.js repository:

    PATH-TO-JSDOC/jsdoc -c conf.json -t PATH-TO-DOCSTRAP/template ./src/ ./readme.md
