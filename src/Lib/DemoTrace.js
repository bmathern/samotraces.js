
// REQUIRES JQUERY

var Samotraces = Samotraces || {};
Samotraces.Lib = Samotraces.Lib || {};


/* Classe Trace */
Samotraces.Lib.DemoTrace = function() {
	// Addint the Observable trait
	Samotraces.Lib.Observable.call(this);
	var current_trace = this;

	/* Nombre d'obsels dans la trace */
	this.count = 0; // sert d'ID pour le prochain observé.
	/* Array d'obsels */
	this.traceSet = [];

};

Samotraces.Lib.DemoTrace.prototype = {

	newObsel: function(type,timeStamp,attributes) {
		var id = this.count;
		this.count++;
		this.traceSet.push(new Samotraces.Objects.Obsel(id,timeStamp,type,attributes));
		//this.notify('updateObsel',{old_obs: old_obs, new_obs: new_obs});
		this.notify('updateTrace',this.traceSet);
	},
// */	
	updateObsel: function(old_obs,new_obs) {
		console.log('Method KtbsTrace:updateObsel() not implemented yet...');
//		this.traceSet.erase(old_obs);
//		new_obs.id = old_obs.id; // check that id stay consistent
//		this.traceSet.push(new_obs);
//		this.notify('updateObsel',{old_obs: old_obs, new_obs: new_obs});
//		return new_obs;
	},
	
	removeObsel: function(obs) {
		console.log('Method KtbsTrace:removeObsel() not implemented yet...');
//		this.traceSet.erase(old_obs);
//		this.notify('removeObsel',obs);
	},
	
	getObsel: function(id) {
		console.log('Method KtbsTrace:getObsel() not implemented yet...');
	},

};


