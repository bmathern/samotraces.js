
// Check if relevant namespaces exist - or create them.
var Samotraces = Samotraces || {};
Samotraces.Widgets = Samotraces.Widgets || {};


/**
 * @mixin
 * @description
 * All widgets should inherit from this Samotraces.Widgets.Widget.
 * 
 * In order to use create a widget that inherits from the 
 * Widget class, one mush include the following code in 
 * the constructor of their widget.
 * <code>
 * </code>
 *
 * @property {String} id Id of the HTML element the
 * Widget is attached to.
 * @property {HTMLElement} element HTML element the
 * Widget is attached to.
 */
Samotraces.Widgets.Widget = (function() {
	/**
	 * Adds the given class to the HTML element to which
	 * this Widget is attached to.
	 * @memberof Samotraces.Widgets.Widget.prototype
	 * @public
	 * @method
	 * @param {String} class_name Name of the class to add
	 */
	function add_class(class_name) {
		this.element.className += ' '+class_name;
	}
	return function(id) {
		// DOCUMENTED ABOVE
		this.id = id;
		this.element = document.getElementById(this.id);
		this.add_class = add_class;

		// call method
		this.add_class('Widget');
		return this;
	};
})();

