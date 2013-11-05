/*
	require jQuery
*/

/** @namespace */
tService = {};
/** 
 * @namespace tService
 * @name TraceManager
 * @constructor 
 * @param options.base_uri 	URI of the base de traces
 * @param options.async 	The synchonized mode
 * @desc a tool to manage traces in a base de traces */
tService.TraceManager = function(options){
	this.base_uri = options.base_uri;
	this.async = options.async ? options.async : true;
	
	/** 
	 * @function
	 * @memberof TraceManager#
	 * @name init_trace
	 * @param t_options.name the name of the trace
	 * @desc initialize an remote trace */
	this.init_trace = function(t_options){
				
		var opt = {};
		opt.base_uri = this.base_uri;		
		opt.async = this.async;
		opt.name = t_options.name;
		var trace = new tService.Trace(opt);
		return trace;
	}
}

/** 
 * @name Trace
 * @constructor 
 * @param options.base_uri 	URI of the base de traces
 * @param options.name 		the name of the trace
 * @param options.async 	The synchonized mode
 * @desc a generic trace */
tService.Trace = function(options){
	//this.trace_manager = options.trace_manager;
	this.base_uri = options.base_uri;
	this.name = options.name; 
	//this.success = options.success,
	//this.error = options.error,
	this.async = options.async ? options.async : true;
	this.model_name = "model1";
	this.model_uri = this.base_uri+this.model_name+"/";
	this.trace_uri = this.base_uri+this.name+"/";
	/** 
	 * @function
	 * @memberof Trace#
	 * @name save
	 * @param s_options.success the callback function if the save is successful
	 * @param s_options.error the callback function if the save is failed
	 * @desc save the trace into the base de traces */
	this.save = function(s_options){
		
		var base_uri = this.base_uri,
		name = this.name,
		successCallback = s_options.success,
		errorCallback = s_options.error,
		async = this.async,
		model_name = this.model_name;

		function trace2Turtle(name,ktbs_base_uri){
			
			var id = ktbs_base_uri + name;
			
			var prefixes = [];
			prefixes.push("@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .");
			prefixes.push("@prefix : <http://liris.cnrs.fr/silex/2009/ktbs#> .");
			//prefixes.push("@prefix : <"+ktbsobsel["model_uri"]+"> .");
			
			var statements = [];
			statements.push("<> :contains <"+id+"/>.");
			statements.push("<"+id+"/> a :StoredTrace.");
			statements.push("<"+id+"/> :hasModel <"+model_name+"/> .");
			statements.push("<"+id+"/> :hasOrigin \"1970-01-01T00:00:00Z\"^^xsd:dateTime.");
			
			// TODO
			
			return prefixes.join("\n")+"\n"+statements.join("\n");
		}
					
		//var obsel = obsel;
		var ctype = "text/turtle";
		//var id = item["id"];
		//var sync = this;
		var trace_in_turtle = trace2Turtle(name,base_uri);
		
		// post to ktbs
		jQuery.ajax({
			url: base_uri,
			type: 'POST',
			data: trace_in_turtle,
			contentType: ctype,
			crossDomain: true,
			success: function(ret){
					console.log("The trace ["+name+"] is created successfully!");
					successCallback(ret);
				},
			error: function(jqXHR, textStatus, errorThrown){
					
					console.log("E: The trace ["+name+"] cannot be created.");
					errorCallback(jqXHR, textStatus, errorThrown);
				},
			async: async
		});		
	}
	
	/** 
	 * @function
	 * @memberof Trace#
	 * @name put_obsels
	 * @param s_options.success the callback function if the save is successful
	 * @param s_options.error the callback function if the save is failed
	 * @param s_options.obsel an obsel
	 * @desc put obsels into the trace in the base de traces */	
	this.put_obsels = function(s_options){
		var trace_uri = this.trace_uri,
			model_uri = this.model_uri,
			obsel = s_options.obsel,
			successCallback = s_options.success,
			errorCallback = s_options.error,
			async = this.async;
		
		function generateObselId(){
			var id = "o"+(new Date()).getTime() + Math.floor(Math.random()*1000);
			return id;
		}
		
		function obsel2Turtle(obsel, trace_uri, model_uri){
			
			var id = trace_uri + generateObselId();
			obsel["id_ktbs"] = id;
			
			var prefixes = [];
			prefixes.push("@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .");
			prefixes.push("@prefix ktbs: <http://liris.cnrs.fr/silex/2009/ktbs#> .");
			prefixes.push("@prefix : <"+model_uri+"> .");
				
			var statements = [];
			statements.push("<"+id+"> ktbs:hasTrace <>.");
			statements.push("<"+id+"> a :"+obsel["type"]+".");
			statements.push("<"+id+"> ktbs:hasSubject \""+obsel["subject"]+"\" .");
			statements.push("<"+id+"> ktbs:hasBegin "+obsel["begin"]+" .");	
			statements.push("<"+id+"> ktbs:hasEnd "+obsel["end"]+" .");
			
			jQuery.each(obsel, function(name,value){
				if(name!="type" && name!="begin" && name!= "end" && name!= "subject"){
					statements.push("<"+id+"> :"+name+" \""+value+"\" .");
				}
			});			
			
			// TODO
			
			return prefixes.join("\n")+"\n"+statements.join("\n");
		}
		
		//var obsel = obsel;
		var ctype = "text/turtle";
		//var id = item["id"];
		//var sync = this;
		var obsel_in_turtle = obsel2Turtle(obsel, trace_uri, model_uri);
		
		// post to ktbs
		jQuery.ajax({
			url: trace_uri,
			type: 'POST',
			data: obsel_in_turtle,
			contentType: ctype,
			crossDomain: true,
			success: function(ret){
					console.log("The obsel ["+obsel["id_ktbs"]+"] is sent successfully!");
					successCallback(ret);
				},
			error: function(jqXHR, textStatus, errorThrown){
					
					console.log("E: The obsel ["+obsel["id_ktbs"]+"] cannot be sent.");
					errorCallback(jqXHR, textStatus, errorThrown);
				},
			async: async
		});
	}
	
	/** 
	 * @function
	 * @memberof Trace#
	 * @name get_obsels
	 * @param s_options.success the callback function if the save is successful
	 * @param s_options.error the callback function if the save is failed
	 * @param s_options.obsel an obsel
	 * @desc put obsels into the trace in the base de traces */	
	this.get_obsels = function(s_options){
		var trace_uri = this.trace_uri,
		successCallback = s_options.success,
		errorCallback = s_options.error,
		async = this.async;
		
		// post to ktbs
		jQuery.getJSON(trace_uri+"@obsels.json",function(data){
			var obsels = data["obsels"];
			
			$.each(obsels, function(obsel){
				// TODO
			});				
			successCallback(obsels);
		});
	}
}


	

	

