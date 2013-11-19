
// Check if relevant namespaces exist - or create them.
var Samotraces = Samotraces || {};
Samotraces.Widgets = Samotraces.Widgets || {};

/**
 * @class Generic Widget for importing a trace from a CSV file.
 * @author Benoît Mathern
 * @constructor
 * @augments Samotraces.Widgets.Widget
 * @see Samotraces.Widgets.Basic.ImportTrace
 * @todo ATTENTION code qui vient d'ailleurs !
 * @description
 * The {Samotraces.Widgets.Basic.ImportTrace} widget is a generic
 * Widget to import a trace from a CSV file.
 * 
 * @todo DESCRIBE THE FORMAT OF THE CSV FILE.
 * @param {String}	html_id
 *     Id of the DIV element where the widget will be
 *     instantiated
 * @param {Samotraces.Lib.Trace} trace
 *     Trace object in which the obsels will be imported.
 */
Samotraces.Widgets.ImportTrace = function(html_id,trace) {
	// WidgetBasicTimeForm is a Widget
	Samotraces.Widgets.Widget.call(this,html_id);

	this.trace = trace;

	this.init_DOM();
};

Samotraces.Widgets.ImportTrace.prototype = {
	init_DOM: function() {

		var p_element = document.createElement('p');

		var text_node = document.createTextNode('Import a trace: ');
		p_element.appendChild(text_node);

		this.input_element = document.createElement('input');
		this.input_element.setAttribute('type','file');
		this.input_element.setAttribute('name','csv-file[]');
		this.input_element.setAttribute('multiple','true');
//		this.input_element.setAttribute('size',15);
//		this.input_element.setAttribute('value',this.timer.time);
		p_element.appendChild(this.input_element);

//		var submit_element = document.createElement('input');
//		submit_element.setAttribute('type','submit');
//		submit_element.setAttribute('value','Import');
//		p_element.appendChild(submit_element);

		this.form_element = document.createElement('form');
		this.input_element.addEventListener('change', this.on_change.bind(this));

		this.form_element.appendChild(p_element);
		this.element.appendChild(this.form_element);

		var button_el = document.createElement('p');
		button_el.innerHTML = "toggle console";
		button_el.addEventListener('click',this.on_toggle.bind(this));
		this.element.appendChild(button_el);

		this.display_element = document.createElement('div');
		this.display_element.style.display = 'none';
		this.element.appendChild(this.display_element);

	},

	on_change: function(e) {
		files = e.target.files;
		var title_el,content_el;
		for( var i=0, file; file = files[i]; i++) {
			title_el = document.createElement('h2');
			title_el.appendChild(document.createTextNode(file.name));
			this.display_element.appendChild(title_el);
			content_el = document.createElement('pre');
			var reader = new FileReader();
			reader.onload = (function(el,parser,trace) {
				return function(e) {
					parser(e.target.result,trace);
					el.appendChild(document.createTextNode(e.target.result));
				};
			})(content_el,this.parse_csv,this.trace);
/*			reader.onprogress = function(e) {
				console.log(e);
			};*/
			reader.readAsText(file);
			this.display_element.appendChild(content_el);		
		}
	},

	on_toggle: function(e) {
		if(this.display_element.style.display == 'none') {
			this.display_element.style.display = 'block';
		} else {
			this.display_element.style.display = 'none';
		}
		return false;
	},
	parse_csv: function(text,trace) {
		
//function CSVToArray() from 
// http://stackoverflow.com/questions/1293147/javascript-code-to-parse-csv-data

		// This will parse a delimited string into an array of
		// arrays. The default delimiter is the comma, but this
		// can be overriden in the second argument.
		function CSVToArray( strData, strDelimiter ){
			// Check to see if the delimiter is defined. If not,
			// then default to comma.
			strDelimiter = (strDelimiter || ",");

			// Create a regular expression to parse the CSV values.
			var objPattern = new RegExp(
				(
					// Delimiters.
					"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

					// Quoted fields.
					"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

					// Standard fields.
					"([^\"\\" + strDelimiter + "\\r\\n]*))"
				),
				"gi"
				);


			// Create an array to hold our data. Give the array
			// a default empty first row.
			var arrData = [[]];

			// Create an array to hold our individual pattern
			// matching groups.
			var arrMatches = null;


			// Keep looping over the regular expression matches
			// until we can no longer find a match.
			while (arrMatches = objPattern.exec( strData )){

				// Get the delimiter that was found.
				var strMatchedDelimiter = arrMatches[ 1 ];

				// Check to see if the given delimiter has a length
				// (is not the start of string) and if it matches
				// field delimiter. If id does not, then we know
				// that this delimiter is a row delimiter.
				if (
					strMatchedDelimiter.length &&
					(strMatchedDelimiter != strDelimiter)
					){

					// Since we have reached a new row of data,
					// add an empty row to our data array.
					arrData.push( [] );

				}


				// Now that we have our delimiter out of the way,
				// let's check to see which kind of value we
				// captured (quoted or unquoted).
				if (arrMatches[ 2 ]){

					// We found a quoted value. When we capture
					// this value, unescape any double quotes.
					var strMatchedValue = arrMatches[ 2 ].replace(
						new RegExp( "\"\"", "g" ),
						"\""
						);

				} else {

					// We found a non-quoted value.
					var strMatchedValue = arrMatches[ 3 ];

				}


				// Now that we have our value string, let's add
				// it to the data array.
				arrData[ arrData.length - 1 ].push( strMatchedValue );
			}

			// Return the parsed data.
			return( arrData );
		}
		
	//	console.log('fichier chargé');
		// guessing the separator
		var sep = text[text.search('[,;\t]')];
		var csv = CSVToArray(text,sep);
	//	console.log('fichier parsé');
		csv.map(function(line) {
			var time = line.shift();
			var type = line.shift();
			var attributes = {};
			for( var i=0; i < (line.length-1)/2 ; i++) {
				if(line[2*i] != "") {
					attributes[line[2*i]] = line[2*i+1];
				}
			}
		//	console.log('new obsel');
			trace.newObsel(type,time,attributes);
		});		
/*
		var output = "";
		csv.forEach(function(line) {
			output += line.join(";")+" ";
		});
		return output;
*/
	}

};

