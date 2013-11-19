
var Samotraces = Samotraces || {};
Samotraces.Lib = Samotraces.Lib || {};

/**
 * Obsel class
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


