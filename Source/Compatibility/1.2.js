var $clear = Function.clear;
var $chk = Utility.check;
var $defined = Type.isDefined;
var $arguments = Function.argument;
var $empty = Function.empty;
var $extend = Object.extend;
var $lambda = Function.from;
var $merge = Object.merge;
var $each = Utility.each;
var $pick = Utility.pick;
var $random = Number.random;
var $splat = $A = Array.from;
var $time = Date.now;
var $try = Function.stab;
var $type = typeOf;

Class.Mutators.options = Class.Mutators.Options;

Object.type = Type.isObject;
Array.type = Type.isArray;
Number.type = Type.isNumber;
RegExp.type = Type.isRegExp;
String.type = Type.isString;
Function.type = Type.isFunction;
Window.type = Type.isWindow;
Document.type = Type.isDocument;

var Hash = new Native('Hash', function(object){
	for (var p in object) this[p] = Utility.clone(object[p]);
});

Hash.implement(Object.map(Object, function(method, name){

	return function(){
		return method.apply(null, [this].concat(arguments));
	};

}));

Hash.implement(Object.from('forEach', function(fn, bind){
	for (var p in this){
		if (!Hash.prototype[p]) fn.call(bind, this[p], p, this);
	}
})).alias({'each': 'forEach'});

[Element, Window, Document].call('alias', {'eliminate': 'dump'});

Element.implement({
	
	setProperty: function(attribute, value){
		return this.set(attribute, value);
	},

	setProperties: function(attributes){
		for (var attribute in attributes) this.set(attribute, attributes[attribute]);
		return this;
	},

	getProperty: function(attribute){
		return this.get(attribute);
	},

	getProperties: function(){
		var args = Array.from(arguments);
		return Object.from(args, args.map(this.get));
	},

	removeProperty: function(attribute){
		return this.erase(attribute);
	},

	removeProperties: function(){
		Array.each(arguments, this.erase, this);
		return this;
	},
	
	setOpacity: function(value){
		return this.set('opacity', value, true);
	},

	getOpacity: function(){
		return this.get('opacity');
	}
	
});

Element.Properties.styles = {set: function(styles){
	this.setStyles(styles);
}};


Element.Properties.events = {set: function(events){
	this.addEvents(events);
}};