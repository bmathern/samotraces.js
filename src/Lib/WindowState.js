
// Check if relevant namespaces exist - or create them.
var Samotraces = Samotraces || {};
Samotraces.Objects = Samotraces.Objects || {};


Samotraces.Objects.WindowState = (function() {
	var WS = function() {
		// Addint the Observable trait
		Samotraces.Objects.Observable.call(this); /** @todo kept for compatibility -> remove */
		Samotraces.Objects.EventBuilder.call(this);
		window.onresize = this.resize.bind(this);
	};
	
	WS.prototype = {
		resize: function() {
			this.notify('resize'); /** @todo kept for compatibility -> remove */
			this.trigger('resize'); 
		},
	};

	// WindowState is Observable
	//Samotraces.Objects.Observable.call(WS.prototype);

	return new WS();
})();

