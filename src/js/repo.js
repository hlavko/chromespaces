var Repo = Class.extend({

	init: function(){
		// prepare storage gateway
		this._gateway = new Gateway();

		// initialize vars
		this.all = null;
		this.current = null;
		this.settings = new Settings();

		// load data from gateway
		this._gateway.load(this);
	},

	add: function(ws){
		this.all.push(ws);
		this.open(ws);
	},

	close: function(ws){
		this.current = null;
		this.save();
	},

	findWsById: function(wsId){
		for (var i=0; i < this.all.length; i++){
			if (this.all[i].id == wsId)
				return this.all[i];
		}
	},

	generateWsId: function(){
		return this.all.length + 1;
	},

	isCurrent: function(ws){
		return this.current != null && ws.id == this.current.id;
	},

	open: function(ws){
		ws.open();
		this.current = ws;
		this.save();
	},

	remove: function(ws){
		if (this.current == ws)
 			this.current = null;
 		
		var index = this.all.indexOf(ws);
 		this.all.splice(index, 1);

 		this.save();
	},

	save: function(){
		this._gateway.save(this);
	},

});