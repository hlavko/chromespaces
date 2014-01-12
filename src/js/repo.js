var Repo = Class.extend({

	init: function(){
		// prepare storage gateway
		this._gateway = new Gateway();

		// initialize vars
		this.all = null;
		this.current = null;

		// load data from gateway
		this._gateway.load(this);
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

	save: function(){
		this._gateway.save(this);
	},

});