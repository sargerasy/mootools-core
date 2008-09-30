/*
Script: Request.HTML.js
	Extends the basic Request Class with additional methods for interacting with HTML responses.

License:
	MIT-style license.
*/

Request.HTML = new Class({

	Extends: Request,

	options: {
		update: false,
		evalScripts: true
	},

	success: function(text){
		var javascript = '';
		var html = text.stripScripts(function(script){
			javascript = script;
		});

		if (this.options.update) $(this.options.update).empty().set('html', html);
		if (this.options.evalScripts) $exec(javascript);

		this.response.html = html;
		this.response.javascript = javascript;
		this.onSuccess(this.response);
	}

});

Element.Properties.load = {
	
	set: function(options){
		var load = this.retrieve('load');
		if (load) load.cancel();
		return this.eliminate('load').store('load:options', $extend({data: this, link: 'cancel', update: this, method: 'get'}, options));
	},

	get: function(options){
		if (options || ! this.retrieve('load')){
			if (options || !this.retrieve('load:options')) this.set('load', options);
			this.store('load', new Request.HTML(this.retrieve('load:options')));
		}
		return this.retrieve('load');
	}

};

Element.implement({
	
	load: function(){
		this.get('load').send(Array.link(arguments, {data: Object.type, url: String.type}));
		return this;
	}

});
