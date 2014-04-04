/**
 * @class Samotraces.KTBS.Obsel is part of the Samotraces.KTBS implementation.
 * @augments Samotraces.Obsel
 * @augments Samotraces.KTBS.Resource
 * @todo TODO update set_methods
 * -> sync with KTBS instead of local change
 */
Samotraces.KTBS.Obsel = function Obsel(param) {
	Samotraces.KTBS.Resource.call(this,param.id,param.uri,'Obsel',param.label || "");

	this._private_check_error(param,'trace');
	this._private_check_error(param,'type');
	this._private_check_default(param,'begin',	Date.now());
	this._private_check_default(param,'end',		this.begin);
	this._private_check_default(param,'attributes',	{});
	this._private_check_undef(param,'relations',	[]); // TODO ajouter rel à l'autre obsel
	this._private_check_undef(param,'inverse_relations',	[]); // TODO ajouter rel à l'autre obsel
	this._private_check_undef(param,'source_obsels',		[]);
}

Samotraces.KTBS.Obsel.prototype = Samotraces.Obsel.prototype;

/*
Samotraces.KTBS.Obsel.prototype.get_ktbs_status = function() {
	return this.ktbs_status
};
*/

