
// Check if relevant namespaces exist - or create them.
var Samotraces = Samotraces || {};
Samotraces.Lib = Samotraces.Lib || {};

/**
 * @class
 * Singleton object that detects when the size of the
 * window changes.
 * Widgets that need to update themselves when the size of
 * the window changes should listen to the 'resize' event
 * triggered by the WindowState object.
 * @fires Samotraces.Lib.WindowState#window:resize
 * @todo fix this... this is not a class
 */
Samotraces.Lib.WindowState = (function() {
	var WS = function() {
		// Addint the Observable trait
		Samotraces.Lib.EventHandler.call(this);
		window.onresize = this.resize.bind(this);
	};
	
	WS.prototype = {
		resize: function() {
			/**
			 * Window resize event.
			 * @event Samotraces.Lib.WindowState#window:resize
			 * @type {object}
			 * @property {String} type - The type of the event (= "window:resize").
			 */
			this.trigger('window:resize'); 
		},
	};

	// WindowState is Observable
	//Samotraces.Objects.Observable.call(WS.prototype);

	return new WS();
})();

