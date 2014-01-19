/**
 * Application repository used as global model which is actively communicating
 * with Gateway to store all application data in real-time.
 *
 * @param  {Gateway} 	_gateway			gateway object used for storing and loading application data
 * @param  {Array}	 	all					array of all workspaces saved in the application
 * @param  {Workspace} 	current 			currently active workspace
 * @param  {Settings} 	settings 			application specific settings
 */
var Repo = Class.extend({

	/**
	 * Constructor.
	 */
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

	/**
	 * Add new workspace and open it immediately.
	 * @param {Workspace} ws 				workspace object
	 */
	add: function(ws){
		this.all.push(ws);
		this.open(ws);
	},

	/**
	 * Close provided workspace.
	 * @param  {Workspace} ws 				workspace object
	 */
	close: function(ws){
		this.current = null;
		this.save();
	},

	/**
	 * Find workspace by id.
	 * @param  {string} 	wsId 			workspace identificator
	 * @return {Workspace} 	found workspace
	 */
	findWsById: function(wsId){
		for (var i=0; i < this.all.length; i++){
			if (this.all[i].id == wsId)
				return this.all[i];
		}
	},

	/**
	 * Test if the provided workspace is opened.
	 * @param  {Workspace}  ws 				workspace object
	 * @return {Boolean} 	is provided workspace opened?
	 */
	isCurrent: function(ws){
		return this.current != null && ws.id == this.current.id;
	},

	/**
	 * Open provided workspace.
	 * @param  {Workspace} ws 				workspace object
	 */
	open: function(ws){
		ws.open();
		this.current = ws;
		this.save();
	},

	/**
	 * Remove workspace from application.
	 * @param  {Workspace} ws 				workspace object
	 */
	remove: function(ws){
		// first, close workspace if it is opened
		if (this.current == ws)
 			this.current = null;
 		
		var index = this.all.indexOf(ws);
 		this.all.splice(index, 1);

 		this.save();
	},

	/**
	 * Save application data.
	 */
	save: function(){
		this._gateway.save(this);
	},

});