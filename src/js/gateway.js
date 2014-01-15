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
			for (var key in config.ws){
				wsConfig = config.ws[key];
				repo.all.push(
					new Workspace(
						wsConfig.id, 
						wsConfig.name, 
						wsConfig.tabs, 
						new Date(wsConfig.last), 
						wsConfig.timesOpened
					)
				);
			}

			// load current workspace
			repo.current = config.current;

			// load settings
			repo.settings.lastId = config.settings.lastId;
		}
	},

	save: function(repo){
		var config = {};
		config.ws = {};
		config.settings = {};

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

			config.ws[wsConfig.id] = wsConfig;
		}

		// save current workspace
		config.current = repo.current;

		// save settings
		config.settings.lastId = repo.settings.lastId;

		// save config to storage
		localStorage.setItem(this._storageId, JSON.stringify(config));
	}

});