
var instanceList = {};
instanceList.widget = {};
instanceList.trace = {};
instanceList.ktbs = {};
instanceList.ktbsBase = {};
instanceList.timer = {};
instanceList.obselSelector = {};
instanceList.timeWindow = {};
instanceList.number = {};
instanceList.string = {};
instanceList.object = {};
instanceList.ws = {};
instanceList.widgetId = {};

var count = 0;

var Module = function(object) {
//	this.mode = 'edit';
	if(object.cons === undefined) {
		throw '"'+object.name+'": undefined constructor or object.';
	}
	this.id = 'instance_'+count;
	count++;
	this.object = object;
//console.log(object);
	this.args = [];
	object.args.forEach(function(arg) {
		var arg_obj = {};
		arg_obj.name = arg.name;
		arg_obj.type = arg.type;
		if(arg.type == 'widgetId') {
		//	console.log('widgetId');
			arg_obj.module = new Module({
				name:	'widget id',
				cons:	this.id,
				args:	[],
				type:	'widgetId'
			});
		} else {
			arg_obj.module = undefined;
		}
		this.args.push(arg_obj);
	},this);
	this.instanciated = false;
	this.instance = undefined;
	this.createDiv();
	instanceList[this.object.type][this.id] = this;
	try { this.instanciate(); }
	catch(err) {}
};

Module.prototype = {
	instanciate: function() {
		if(this.instanciated) {
			throw 'Module already instanciated';
		}
		var arg_array = [];
		this.args.forEach(function(arg) {
			if(arg.module === undefined) {
				throw 'Argument '+arg.name+' is missing'
			};
			if(!arg.module.instanciated) {
				throw 'Argument '+arg.name+' is not instanciated'
			};
			// build argument array
			arg_array.push(arg.module.instance);
		});
		// remove HTML edit
		if(this.object.type == 'widget') {
			$('#'+this.id).html('');
			$('#'+this.id).removeClass('edit');
		} else {
			$('#'+this.id).addClass('instanciated');
		}
		if(typeof(this.object.cons) == "function") {
			console.log('new... '+this.object.name);
			console.log(arg_array.length+' arguments');
			switch(arg_array.length) {
				case 0:
					this.instance = new this.object.cons();
					break;
				case 1:
					this.instance = new this.object.cons(arg_array[0]);
					break;
				case 2:
					this.instance = new this.object.cons(arg_array[0],arg_array[1]);
					break;
				case 3:
					this.instance = new this.object.cons(arg_array[0],arg_array[1],arg_array[2]);
					break;
				case 4:
					this.instance = new this.object.cons(arg_array[0],arg_array[1],arg_array[2],arg_array[3]);
					break;
				case 5:
					this.instance = new this.object.cons(arg_array[0],arg_array[1],arg_array[2],arg_array[3],arg_array[4]);
					break;
				case 6:
					this.instance = new this.object.cons(arg_array[0],arg_array[1],arg_array[2],arg_array[3],arg_array[4],arg_array[5]);
					break;
				default:
					throw 'Instanciation not allowed with that many parameters';
			}
		//	this.instance = new this.object.cons.apply(null,arg_array);
			console.log('success!!!');
		} else {
			console.log('copy... '+this.object.name);
			this.instance = this.object.cons;
		}
		// TODO check that the instance was actually created!!!
		this.instanciated = true;
		$('option.'+this.id).addClass('instanciated');
		this.notify('instanciated',this);
	},
	update: function(msg,obj) {
		switch(msg) {
			case 'instanciated':
				try { this.instanciate(); }
				catch(err) {}
				break;
			default:
				break;
		}
	},
	attachModule: function(arg_number,module) {
		this.args[arg_number].module = module;
		this.args[arg_number].module.addObserver(this);
		try { this.instanciate(); }
		catch(err) {}
	},
	createDiv: function() {
		var panel = this.object.type == 'widget' ? '#app':'#instances-panel';
		if(this.object.type == 'widget') {
		}
		$(panel).append('<div id="'+this.id+'"></div>');
		$('#'+this.id).addClass(this.object.type);
		this.editHTML();
	},
	editHTML: function() {
		$('#'+this.id).addClass('edit');
		var html = ''+this.id+' - '+this.object.name+' (';
		if(this.args.length > 0) {
			var arg_list = this.args.map(function(arg,index) {
				switch(arg.type) {
					case 'widgetId':
						return this.id;
					case 'object':
						var out = arg.name+':<form action="" class="edit">';
						out += '<input type="text" name="'+index+'" size="32"></input>';
						out += '</form>';
						return out;
					case 'number':
						var out = arg.name+':<form action="" class="edit">';
						out += '<input type="text" name="'+index+'" size="8"></input>';
						out += '</form>';
						return out;
					case 'string':
						var out = arg.name+':<form action="" class="edit">';
						out += '<input type="text" name="'+index+'" size="8"></input>';
						out += '</form>';
						return out;
					default:
						var out = '<select name="'+index+'">'
						out += '<option value="" disabled="disabled" selected="selected">'+arg.name+'</option>';
						for(var instance_id in instanceList[arg.type]) {
	console.log(instance_id);
							out += '<option value="'+instance_id+'" class="'+instance_id+'">'+instance_id+'</option>';
						}
						out += '<option value="-1">new '+arg.name+'</option>';
						out += '</select>';
						return out;
				}
			},this);
			html += arg_list.join(',');
		}
		html += ')';
		$('#'+this.id).html(html);
		$('#'+this.id+' select').change(this, function(e) {
				var module;
				var arg = e.data.args[e.target.name];
				if(e.target.value == -1) {
					module = new Module(ObjectList[arg.type][0]);
				} else {
					module = instanceList[arg.type][e.target.value];
				}
				e.data.attachModule(e.target.name,module);
	//			e.data.args[e.target.name].module = module;
			});
		$('#'+this.id+' form').submit(this, function(e) {
				e.preventDefault();
		//		console.log(e);
		//		console.log(e.target[0].value);
				var value = e.target[0].value;
				var arg = e.data.args[e.target[0].name];
				if(arg.type == 'object') {
					value = eval(value);
				};
				var	module = new Module({
						name:	'User input',
						cons:	value,
						args:	[],
						type:	arg.type
					});
				e.data.attachModule(e.target[0].name,module);
	//			e.data.args[e.target[0].name].module = module;
			});
	},
};



function init() {


Samotraces.Objects.Observable.call(Module.prototype);

	// Samotraces is called Σ for short
	var Σ = Samotraces;

	ObjectList = {
		trace:	[
			{
				name:	'Trace KTBS',
				cons:	Σ.Objects.KtbsTrace,
				args:	[
						{name: 'url', type: 'string'},
						],
				type:	'trace'
			},
			{
				name:	'Trace KTBS4js',
				cons:	Σ.Objects.Ktbs4jsTrace,
				args:	[
						{name: 'url', type: 'string'},
						],
				type:	'trace'
			},
			{
				name:	'Trace',
				cons:	Σ.Objects.DemoTrace,
				args:	[],
				type:	'trace'
			},
		],
		ktbs:		[
			{
				name:	'KTBS',
				cons:	Σ.Objects.Ktbs,
				args:	[
						{name: 'url', type: 'string'},
						],
				type:	'ktbs'
			},
		],
		ktbsBase:		[
			{
				name:	'KTBS base',
				cons:	Σ.Objects.KtbsBase,
				args:	[
						{name: 'url', type: 'string'},
						],
				type:	'ktbsBase'
			},
		],
		ws:		[
			{
				name:	'WS',
				cons:	Σ.Objects.WindowState,
				args:	[],
				type:	'ws'
			},
		],
		timer:	[
			{
				name:	'Timer',
				cons:	Σ.Objects.Timer,
				args:	[
						{name: 'time', type: 'number'},
						],
				type:	'timer'
			},
		],
		obselSelector:	[
			{
				name:	'Obsel selector',
				cons:	Σ.Objects.ObselSelector,
				args:	[],
				type:	'obselSelector'
			},
		],
		timeWindow:		[
			{
				name:	'Time window',
				cons:	Σ.Objects.TimeWindowCenteredOnTime,
				args:	[
						{name: 'timer', type: 'timer'},
						{name: 'width', type: 'number'},
						],
				type:	'timeWindow'
			}
		]
	};

	WidgetList = [
		{
			name:	'Trace visualisation',
			cons:	Σ.Widgets.d3Basic.TraceDisplayIcons,
			args:	[
						{name: 'id', type: 'widgetId'},
						{name: 'trace', type: 'trace'},
						{name: 'obsel selector', type: 'obselSelector'},
						{name: 'time window', type: 'timeWindow'},
						{name: 'options', type: 'object'},
					],
			type:	'widget'
		},			
		{
			name:	'Obsel inspector', 
			cons:	Σ.Widgets.Basic.ObselInspector,
			args:	[
						{name: 'id', type: 'widgetId'},
						{name: 'obsel selector', type: 'obselSelector'},
					],
			type:	'widget'
		},			
		{
			name:	'Window scale', 
			cons:	Σ.Widgets.d3Basic.WindowScale,
			args:	[
						{name: 'id', type: 'widgetId'},
						{name: 'time window', type: 'timeWindow'},
					],
			type:	'widget'
		},		
		{
			name:	'Time form (readable)', 
			cons:	Σ.Widgets.Basic.ReadableTimeForm,
			args:	[
						{name: 'id', type: 'widgetId'},
						{name: 'timer', type: 'timer'},
					],
			type:	'widget'
		},		
		{
			name:	'Time form', 
			cons:	Σ.Widgets.Basic.TimeForm,
			args:	[
						{name: 'id', type: 'widgetId'},
						{name: 'timer', type: 'timer'},
					],
			type:	'widget'
		},	
		{
			name:	'KTBS - list bases', 
			cons:	Σ.Widgets.ktbs.ListBases,
			args:	[
						{name: 'id', type: 'widgetId'},
						{name: 'ktbs', type: 'ktbs'},
					],
			type:	'widget'
		},
	];

	function splitId(string) {
		return string.split('_').pop();
	}

	function instanciateObject(object) {
		if(object === undefined) {
			object = category[0]; // if not defined, take the first object of the category
		}
		
	}


	WidgetList.forEach(function(el,key) {
		$('#widgets-panel').append('<div id="widget_'+key+'"><p>'+el.name+'</p></div>');
	});
	$('#widgets-panel div').click(function(e) {
			console.log('Clicked on "'+WidgetList[splitId(e.target.id)].name+'" widget.');
			new Module(WidgetList[splitId(e.target.id)]);
			//addWidget(WidgetList[splitId(e.target.id)]);
		});
	
}

// run the previous code when all the page has been properly loaded.
window.addEventListener('DOMContentLoaded', init );







