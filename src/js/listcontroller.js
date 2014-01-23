/**
 * List view controller handle workspace listings with fundamental app management.
 * @param  {Repo} 	_repo			application repository
 * @param  {string} _state			current workspace listing (allowed: 'all', 'recent')
 */
var ListController = Controller.extend({

	/**
	 * Constructor.
	 * @param  {Repo} 	repo 		application repository
	 */
	init: function(repo){
		this._super(repo, $("#list-view"));

		// toggle visibility 'on'
		this.toggle(true);

		// prepare view
		this.prepare();

		// set 'all' listings as default
		this.update("all");
	},

	/**
	 * Create new workspace and opened proper view.
	 */
	add: function(){
		// generate ws id with settings unique generator
		var wsId = this._repo.settings.generateId();

		// create new workspace
		var ws = new Workspace(wsId, "workspace" + wsId, [], 0, 0);

		// hide list view
		this.toggle(false);

		// and to switch to new create controller for clicked ws
		new ItemController(this._repo, ws, this);
	},

	/**
	 * Close provided workspace.
	 * @param  {Workspace} ws 				workspace object
	 */
	close: function(ws){
		// unattach current ws
		this._repo.close();

		// close all windows
		this.closeAllWindows();

		// open empty window
		chrome.windows.create({});

		this.update();
	},

	/**
	 * Close all opened windows (with all opened tabs).
	 */
	closeAllWindows: function(){
		// close all windows
		chrome.windows.getAll({},function(windows){
			for (var i=0; i < windows.length; i++){
				chrome.windows.remove(windows[i].id);
			}
		});
	},

	/**
	 * Edit workspace with provided workspace identificator
	 * @param  {string} wsId 			workspace identificator
	 */
	edit: function(wsId){
		// find ws by id
		var ws = this._repo.findWsById(wsId);

		// hide list view
		this.toggle(false);

		// create controller for provided ws
		new ItemController(this._repo, ws, this);
	},

	/**
	 * Open provided workspace.
	 * @param  {Workspace} ws 			workspace object
	 */
	open: function(ws){
		// change current ws
		this._repo.open(ws);

		// close all windows
		this.closeAllWindows();

		// open window with ws tabs
		chrome.windows.create({"url":ws.tabs});

		this.update();
	},

	/**
	 * Attach view listeners for basic actions. 
	 */
	prepare: function(){
		$("#recent-button").bind('click', {controller: this}, function(event){
			event.data.controller.update("recent");
		});

		$("#all-button").bind('click', {controller: this}, function(event){
			event.data.controller.update("all");
		});

		$("#add-workspace").bind('click', {controller: this}, function(event){
			event.data.controller.add();
		});
	},

	/**
	 * Show workspace list based on provided listing.
	 * @param  {string} state 			workspace listing keyword
	 */
	show: function(state){
		var table = $("#list tbody");

		// dispose current list content
		table.html('');

		if (this._repo.all.length == 0){
			// dont show table if there are no workspaces
			$(".tabs").hide();
			return;
		}
		else{
			$(".tabs").show();
		}

		if (state == "all"){
			// sort by name
			this._repo.all.sort(function(a, b){
				var aName = a.name.toLowerCase();
				var bName = b.name.toLowerCase(); 
				return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
			});
		}
		else if (state == "recent"){
			// sort by recently opened
			this._repo.all.sort(function(a, b){
				var aLast = a.last;
				var bLast = b.last; 
				return ((aLast > bLast) ? -1 : ((aLast < bLast) ? 1 : 0));
			});
		}

		// fill table with workspaces
		// and attach proper listeners
		var ws;
		for (var i=0; i < this._repo.all.length; i++){
			ws = this._repo.all[i];

			var row = $("<tr id='" + ws.id + "'></tr>");

			if (this._repo.isCurrent(ws))
				row.addClass("active")

			var colName = $("<td class='name'>" + ws.name +  "</td>").bind('click', {controller: this, repo: this._repo}, function(event){
				var wsId = $(this).parent().attr("id");
				var ws = event.data.repo.findWsById(wsId);
				event.data.repo.isCurrent(ws) ? event.data.controller.close(ws) : event.data.controller.open(ws);
			});

			var colEdit = $("<td class='edit'><a href='javascript:void(0)'>more</a></td>").bind('click', {controller: this}, function(event){
				var wsId = $(this).parent().attr("id");
				event.data.controller.edit(wsId);
			});

			row.append(colName);
			row.append(colEdit);

			table.append(row);
		}

		table.append(row);
	},

	/**
	 * Update tabs based on active workspace listing.
	 * @param  {string} state 				workspace listing
	 */
	update: function(state){
		if (!state)
			state = this._state;
		else
			this._state = state;

		if (state == "all"){
			$("#recent-button .label").addClass("closed");
			$("#recent-button .label").removeClass("opened");
			$("#all-button .label").addClass("opened");
			$("#all-button .label").removeClass("closed");
		}
		else if (state == "recent"){
			$("#recent-button .label").addClass("opened");
			$("#recent-button .label").removeClass("closed");
			$("#all-button .label").addClass("closed");
			$("#all-button .label").removeClass("opened");
		}

		this.show(state);
	}

});