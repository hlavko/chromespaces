var Gateway = Class.extend({

	init: function(){
		// set key to access storage items
		this._storageId = "chromespaces";
	},

	load: function(repo){
		// prepare array for workspaces
		repo.all = [];

		// load config from storage
		var item = localStorage.getItem(this._storageId);

		// skip if there is no saved config yet
		if (item != undefined){
			var config = JSON.parse(item);

			// load all workspaces
			var wsConfig;
			for (var key in repo.workspaces){
				wsConfig = repo.workspace[key];
				repo.all.push(
					new Workspace(
						wsConfig.id, 
						wsConfig.name, 
						wsConfig.tabs, 
						wsConfig.last, 
						wsConfig.timesOpened
					)
				);
			}

			// load current workspace
			repo.current = config.current;
		}
	},

	save: function(repo){
		var config = {};

		// save all workspaces
		var ws;
		for (var i=0; i < repo.all.length; i++){
			var wsConfig = {};
			ws = repo.all[i];

			wsConfig.id = ws.id;
			wsConfig.name = ws.name;
			wsConfig.tabs = ws.tabs;
			wsConfig.last = ws.last;
			wsConfig.timesOpened = ws.timesOpened;
		}

		// save current workspace
		config.current = repo.current;

		// save config to storage
		localStorage.setItem(this._storageId, JSON.stringify(config));
	}

});