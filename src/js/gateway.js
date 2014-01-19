/**
 * Gateway for reading and writing app data to the localStorage 
 * in the chrome browser.
 */
var Gateway = Class.extend({

	/**
	 * Constructor.
	 */
	init: function(){
		// set key to access storage items
		this._storageId = "chromespaces";
	},

	/**
	 * Load app data from localStorage and store them in the provided repository.
	 * App data must be JSON.parsed from localStorage because they are stored as strings.
	 * @param  {Repo} 	repo 		current app repository
	 */
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

	/**
	 * Save app data to localStorage which are stored in provided repository.
	 * App data must be stringified before saving to the localStorage
	 * because only strings are allowed to store.
	 * @param  {Repo} 	repo 		current app repository
	 */
	save: function(repo){
		// create empty objects for storing app data
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