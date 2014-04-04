/**
 * @summary Resource Objects that is synchronised to a kTBS
 * @description Resource Objects are KTBS objects. All resources
 * have an uri, an id and an optional label
 * @class Resource Objects have an uri, an id and an optional label
 * @param {String} id Id of the Resource
 * @param {String} url URI of the Resource
 * @param {String} type Type of the Resource ('KTBS','Base',
 *     'Trace','StoredTrace','ComputedTrace' or 'Obsel')
 * @param {label} [label] Label of the Resource
 */
Samotraces.KTBS.Resource = (function() {
	/**
	 * @summary Returns the resource type of the Resource.
	 * @memberof Samotraces.KTBS.Resource.prototype
	 * @returns {String} Resource type ('KTBS','Base',
	 *     'Trace','StoredTrace','ComputedTrace' or 'Obsel').
	 */
	function get_resource_type() { return this.type; }

	// RESOURCE API
	/**
	 * @summary Returns the ID of the Resource.
	 * @memberof Samotraces.KTBS.Resource.prototype
	 * @returns {String} Resource ID.
	 */
	function get_id() { return this.id; }
	/**
	 * @summary Returns the URI of the Resource. 
	 * @memberof Samotraces.KTBS.Resource.prototype
	 * @returns {String} Resource URI.
	 */
	function get_uri() { return this.uri; }
	/**
	 * @summary Forces the Resource to synchronise with the KTBS.
	 * @memberof Samotraces.KTBS.Resource.prototype
	 * @description
	 * Forces the Resource to synchronise with the KTBS.
	 * This method triggers a Ajax query that will
	 * trigger the _on_state_refresh_ method of the Resource 
	 * on success.
	 */
	function force_state_refresh() {
		
		$.ajax({
			url: this.uri,
			type: 'GET',
			dataType: 'json',
			error: (function(jqXHR, textStatus, errorThrown) {
console.log("error",this);
				Samotraces.log("Cannot refresh "+this.get_resource_type()+" " + this.uri + ": ", textStatus + ' ' + JSON.stringify(errorThrown));
			}).bind(this),
			success: this._on_state_refresh_.bind(this),
		/*	error: function(jqXHR,textStatus,error) {
				console.log("Error in force_state_refresh():");
				console.log([jqXHR,textStatus,error]);
				if(textStatus == "parsererror") {
					console.log("--> parsererror -->");
					console.log(jqXHR.responseText);
				}
			}*/
		});
	}
	/**
	 * @summary Forces the Resource to synchronise 
	 * with at a given refreshing rate.
	 * @memberof Samotraces.KTBS.Resource.prototype
	 * @description
	 * Forces the Resource to synchronise with the KTBS
	 * every period seconds.
	 * @param {Number} period Time in seconds between two synchronisations.
	 */
	function start_auto_refresh(period) {
		this.auto_refresh_id?this.stop_auto_refresh():null;
		this.auto_refresh_id = window.setInterval(this.force_state_refresh.bind(this), period*1000);
	}
	/**
	 * @summary Stops the autorefresh synchronisation
	 * of the Resource.
	 * @memberof Samotraces.KTBS.Resource.prototype
	 * @description
	 * Stops the autorefresh synchronisation of
	 * the Resource.
	 */
	function stop_auto_refresh() {
		if(this.auto_refresh_id) {
			window.clearInterval(this.auto_refresh_id);
			delete(this.auto_refresh_id);
		}
	}
//		function _on_state_refresh_(data) { this.data = data; console.log("here"); }
	/**
	 * @todo METHOD NOT IMPLEMENTED
	 */
	function get_read_only() {}
	/**
	 * @summary Delete the resource from the KTBS
	 * @todo IMPROVE THIS METHOD SO THAT PROPER EVENT IS RAISED
	 *     WHEN A RESOURCE IS DELETED.
	 */
	function remove() {
		function refresh_parent() {
			//TROUVER UN MOYEN MALIN DE RAFRAICHIR LA LISTE DES BASES DU KTBS...
		}
		$.ajax({
			url: this.uri,
			type: 'DELETE',
			success: refresh_parent.bind(this),
			error: function(jqXHR,textStatus,error) {
                 throw "Cannot delete "+this.get_resource_type()+" " + this.uri + ": " + textStatus + ' ' + JSON.stringify(errorThrown);
			}
		});
	}
	/**
	 * @summary Returns the label of the Resource
	 */
	function get_label() { return this.label; }
	/**
	 * @todo METHOD NOT IMPLEMENTED
	 */
	function set_label() {}
	/**
	 * @todo METHOD NOT IMPLEMENTED
	 */
	function reset_label() {}

	// ADDED FUNCTIONS
	/**
	 * Method used to check if the distant value is different
	 * from the current local value (and update the local value
	 * if there is a difference.
	 * @private
	 * @param local_field {String} Name of the field of the this 
	 *     object containing the information to check.
	 * @param distant {Value} Value of the distant information.
	 * @param message_if_changed {String} Message to trigger if
	 *     the information has been updated.
	 */
	function _check_change_(local_field,distant,message_if_changed) {
		// TODO check if this is the wanted behaviour:
		// If distant is undefined -> what to do?
		if(distant !== undefined && this[local_field] !== distant) {
			this[local_field] = distant;
			this.trigger(message_if_changed);
		}
	}

	return function(id,uri,type,label) {
		// a Resource is an EventHandler
		Samotraces.EventHandler.call(this);
		// DOCUMENTED ABOVE
		// ATTRIBUTES
		this.id = id;
		this.uri = uri;
		this.label = label;
		this.type = type;
		// API METHODS
		this.get_id = get_id;
		this.get_uri = get_uri;
		this.force_state_refresh = force_state_refresh;
		this.get_read_only = get_read_only;
		this.remove = remove;
		this.get_label = get_label;
		this.set_label = set_label;
		this.reset_label = reset_label;
		// helper
		this.get_resource_type = get_resource_type;
		this._check_change_ = _check_change_;
		this.start_auto_refresh = start_auto_refresh;
		this.stop_auto_refresh = stop_auto_refresh;
		return this;
	};
})();

