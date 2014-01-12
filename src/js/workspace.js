var Workspace = Class.extend({

	init: function(id, name, tabs, last, timesOpened){
		this.id = id;
		this.name = name;
		this.tabs = tabs;
		this.last = last;
		this.timesOpened = timesOpened;
	},

	open: function(){
		timesOpened += 1;
	},

	close: function(){
		// todo
	}

});