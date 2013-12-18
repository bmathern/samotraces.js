
var Samotraces = Samotraces || {};
Samotraces.Lib = Samotraces.Lib || {};

/**
 * Obsel is a shortname for the 
 * {@link Samotraces.Lib.Obsel}
 * object.
 * @typedef Obsel
 * @see Samotraces.Lib.Obsel
 */
/**
 * @summary JavaScript Obsel class
 * @class JavaScript Obsel class
 * @param {String} id Identifier of the obsel.
 * @param {Number} timestamp Timestamp of the obsel
 * @param {String} type Type of the obsel.
 * @param {Object} attributes Optional attributes of the obsel.
 */
Samotraces.Lib.Obsel = function(id,timestamp,type,attributes) {
	this.id = id;
	this.timestamp = timestamp;
	this.type = type;
	this.attributes = attributes;
};


