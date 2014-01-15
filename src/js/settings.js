var Settings = Class.extend({

	init: function(){
		this.lastId = 0;
	},

	generateId: function(){
		return ++this.lastId;
	}

});