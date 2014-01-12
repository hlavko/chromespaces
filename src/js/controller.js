var Controller = Class.extend({

	init: function(repo, view){
		this._repo = repo;
		this._view = view;
	},

	toggle: function(value){
		value ? this._view.show() : this._view.hide();
	}

});