
// THIS FILE MUST BE INCLUDED FIRST!!!

// Check if relevant namespaces exist - or create them.
var Samotraces = Samotraces || {};
Samotraces.Objects = Samotraces.Objects || {};

/**
 * @class Observable class
 * @description
 * The Observable Object is not a class. However, it is 
 * designed for other classes to inherit of a predefined
 * Observable behaviour. For this reason, this function is
 * documented as a Class. 
 * 
 * In order to use create a class that "inherits" from the 
 * "Observable class", one must run the following code:
 * <code>
 * Samotraces.Objects.Observable.call(myObject.prototype);
 * </code>
 *
 * @property {Array} observerList
 *     Array of objects that subscribed as observers.
 */
Samotraces.Objects.Observable = (function() {
	/**
	 * Notify all the observer elements with a message and
	 * an associated object.
	 * @memberof Samotraces.Objects.Observable.prototype
	 * @param {String} message
	 *     Message transmitted to the Observers.
	 * @param {Object} object
	 *     Object sent with the message to the Observers.
	 */
	function notify(message,object) {
		this.observerList.forEach(function(observer) {
			observer.update(message,object);
		});
	}
	/**
	 * Add an Observer object to the list of Observers
	 * @memberof Samotraces.Objects.Observable.prototype
	 * @param {Observer} observer
	 *     The Observer object to add to the Observer list.
	 */
	function addObserver(observer) {
		this.observerList.push(observer);
	}
	return function() {
		// DOCUMENTED ABOVE
		this.observerList = this.observerList || [];
		this.notify = notify;
		this.addObserver = addObserver;
		return this;
	};
})();

// Technique found at: http://javascriptweblog.wordpress.com/2011/05/31/a-fresh-look-at-javascript-mixins/
// In order to use it:
//Samotraces.Objects.Observable.call(myObject.prototype);

