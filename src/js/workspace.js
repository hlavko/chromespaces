var Workspace = Class.extend({

	init: function(id, name, tabs, last, timesOpened){
		this.id = id;
		this.name = name;
		this.tabs = tabs;
		this.last = last;
		this.timesOpened = timesOpened;
	},

	addTabs: function(tabs){
		this.tabs = tabs;
	},

	open: function(){
		this.timesOpened += 1;
		this.last = new Date();
	},

	close: function(){
		// todo
	}

});