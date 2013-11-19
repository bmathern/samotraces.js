
// THIS FILE MUST BE INCLUDED FIRST!!!

// Check if relevant namespaces exist - or create them.
var Samotraces = Samotraces || {};
Samotraces.Lib = Samotraces.Lib || {};

/**
 * @mixin
 * @description
 * The EventHandler Object is not a class. However, it is 
 * designed for other classes to inherit of a predefined
 * Observable behaviour. For this reason, this function is
 * documented as a Class. 
 * 
 * In order to use create a class that "inherits" from the 
 * "EventHandler class", one must run the following code in 
 * the constructor:
 * <code>
 * Samotraces.Lib.EventHandler.call(this);
 * </code>
 *
 * @property {Object} callbacks
 *     Hash matching callbacks to event_types.
 */
Samotraces.Lib.EventHandler = (function() {
	/**
	 * Triggers all the registred callbacks.
	 * @memberof Samotraces.Lib.EventBuilder.prototype
	 * @param {String} event_type
	 *     The type of the triggered event.
	 * @param {Object} object
	 *     Object sent with the message to the listeners (see 
	 *     {@link Samotraces.Lib.EventBuilder#addEventListener}).
	 */
	function trigger(event_type,object) {
		var e = { type: event_type, data: object };
		if(this.callbacks[event_type]) {
			this.callbacks[event_type].map(function(f) { f(e); });
		}
		/*
		this.callbacks[event_type].forEach(function(callback) {
			callback(e);
		});
		*/
	}
	/**
	 * Adds a callback for the specified event
	 * @memberof Samotraces.Lib.EventBuilder.prototype
	 * @param {String} event_type
	 *     The type of the event to listen to.
	 * @param {Function} callback
	 *     Callback to call when the an event of type 
	 *     event_type is triggered. Note: the callback
	 *     can receive one argument that contains
	 *     details about the triggered event.
	 *     This event argument contains two fields:
	 *     event.type: the type of event that is triggered
	 *     event.data: optional data that is transmitted with the event
	 */
	function addEventListener(event_type,callback) {
		if({}.toString.call(callback) !== '[object Function]') {
			console.log(callback);
			throw "Callback for event "+event_type+" is not a function";
		}
		this.callbacks[event_type] = this.callbacks[event_type] || [];
		this.callbacks[event_type].push(callback);
	}
	return function() {
		// DOCUMENTED ABOVE
		this.callbacks = this.callbacks || {};
		this.trigger = trigger;
		this.addEventListener = addEventListener;
		return this;
	};
})();



