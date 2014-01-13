var ItemController = Controller.extend({

	init: function(repo, ws, list){
		this._super(repo, $("#item-view"));
		this._ws = ws;
		this._list = list;
		console.log(list, this._list)

		this.toggle(true);

		// add listeners

		$("#add-button").bind('click', {controller: this}, function(event){
			event.data.controller.add(wsId);
		});

		$("#cancel-button").bind('click', {controller: this}, function(event){
			event.data.controller.cancel();
		});
	},

	add: function(){

	},

	cancel: function(){
		this.toggle(false);
		this._list.showRecent();
		this._list.toggle(true);
	},

	close: function(){
		
	},

	open: function(){
		
	},

	remove: function(){
		
	},

	save: function(){
		
	},

	update: function(){

	}

});