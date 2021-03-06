/*
Script: Event.js
	Contains the Browser native event enhancement, to make the event object completely crossbrowser.

License:
	MIT-style license.
*/

var Event = new Native('Event', function(event){
	event = event || window.event || null;
	if (event == null) event = {};
	if (event.event) event = event.event;
	this.event = event;
	Browser.event = this;
});

Event.extend(new Accessors).defineGetters({

	shift: function(){
		return this.event.shiftKey;
	},

	control: function(){
		return this.event.ctrlKey;
	},

	alt: function(){
		return this.event.altKey;
	},

	meta: function(){
		return this.event.metaKey;
	},

	rightClick: function(){
		var event = this.event;
		return (event.which == 3) || (event.button == 2);
	},

	wheel: function(){
		var event = this.event;
		return (event.wheelDelta) ? event.wheelDelta / 120 : -(event.detail || 0) / 3;
	}

});

Storage.store(Event, 'keys', {
	13: 'enter', 38: 'up', 40: 'down', 37: 'left', 39: 'right', 27: 'esc', 32: 'space', 8: 'backspace', 9: 'tab', 46: 'delete'
});

Event.extend({
	
	defineKeyCode: function(code, name){
		Storage.retrieve(this, 'keys')[code] = name;
		return this;
	},

	lookupKeyCode: function(code){
		return Storage.retrieve(this, 'keys')[code];
	}
	
});

Event.defineGetter('key', function(){
	var event = this.event;
	
	var code = event.which || event.keyCode;
	
	var named = Event.lookupKeyCode(code);
	if (named) return named;

	if (event.type == 'keydown'){
		var fKey = code - 111;
		if (fKey > 0 && fKey < 13) return 'f' + fKey;
	}

	return String.fromCharCode(code).toLowerCase();
});

Event.implement({
	
	get: function(key){
		key = key.camelCase();
		if (this.hasOwnProperty(key)) return this[key];
		var getter = Event.lookupGetter(key);
		return this[key] = (getter) ? getter.call(this) : this.event[key];
	}.getMany(),
	
	set: function(key, value){
		var setter = Event.lookupSetter(key = key.camelCase());
		(setter) ? setter.call(this, value) : this[key] = value;
		return this;
	}.setMany()
	
});

Event.defineGetters({
	
	target: function(){
		var event = this.event;
		var target = event.target || event.srcElement;
		while (target && target.nodeType == 3) target = target.parentNode;
		return document.id(target);
	},
	
	relatedTarget: function(){
		var event = this.event, related = null;
		switch (event.type){
			case 'mouseover': related = event.relatedTarget || event.fromElement; break;
			case 'mouseout': related = event.relatedTarget || event.toElement;
		}
		var test = function(){
			while (related && related.nodeType == 3) related = related.parentNode;
			return true;
		};
		var hasRelated = (Browser.Engine.gecko) ? Function.stab(test) : test();
		return (hasRelated) ? document.id(related) : null;
	},
	
	client: function(){
		var event = this.event;
		return {
			x: (event.pageX) ? event.pageX - window.pageXOffset : event.clientX,
			y: (event.pageY) ? event.pageY - window.pageYOffset : event.clientY
		};
	},
	
	page: function(){
		var event = this.event, doc = document;
		doc = (!doc.compatMode || doc.compatMode == 'CSS1Compat') ? doc.html : doc.body;
		return {
			x: event.pageX || event.clientX + doc.scrollLeft,
			y: event.pageY || event.clientY + doc.scrollTop
		};
	}
	
});

Event.implement({

	stopPropagation: function(){
		var event = this.event;
		if (event.stopPropagation) event.stopPropagation();
		else event.cancelBubble = true;
		return this;
	},

	preventDefault: function(){
		var event = this.event;
		if (event.preventDefault) event.preventDefault();
		else event.returnValue = false;
		return this;
	},
	
	stop: function(){
		return this.stopPropagation().preventDefault();
	}

});
