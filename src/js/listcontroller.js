var ListController = Controller.extend({

	init: function(repo){
		this._super(repo, $("#list-view"));

		this.toggle(true);
		this.showRecent();
	},

	add: function(){
		// create new workspace
		var ws = new Workspace(this._repo.generateWsId(), "", [], 0, 0);

		// hide list view
		this.toggle(false);

		// create controller for clicked ws
		new ItemController(this._repo, ws);
	},

	closeAllWindows: function(){
		// close all windows
		chrome.windows.getAll({},function(windows){
			for (var i=0; i < windows.length; i++){
				chrome.windows.remove(windows[i].id);
			}
		});
	},

	edit: function(wsId){
		// find clicked ws by id
		var ws = this._repo.findWsById(wsId);

		// hide list view
		this.toggle(false);

		// create controller for clicked ws
		new ItemController(_repo, ws);
	},

	open: function(){

	},

	showAll: function(){

	},

	showRecent: function(){
		// prepare table
		var table = $("#list-recent tbody");

		// dispose current list content
		table.html('');

		// fill table with workspaces
		var ws;
		for (var i=0; i < this._repo.all.length; i++){
			ws = this._repo.all[i];

			var row = $("<tr id='" + ws.id + "'></tr>").click(function(){
				var wsId = $(this).parent().attr("id");
				toggleWs(wsId);
			});

			var colName = $("<td>" + ws.name +  "</td>");
			var colEdit = $("<a href='javascript:void(0)'>edit</a></td>").bind('click', {controller: this}, function(event){
				var wsId = $(this).parent().attr("id");
				event.data.controller.edit(wsId);
			});

			row.append(colName);
			row.append(colEdit);

			table.append(row);
		}

		// add new ws option to the table
		var row = $("<tr><td>Add Workspace...</td></tr>").bind('click', {controller: this}, function(event){
			event.data.controller.add();
		});
		
		table.append(row);
	},

	toggleWs: function(wsId){
		// close ws
		if (wsId == _repo.current.id){
			// unattach current ws
			_repo.current = null;

			// close all windows
			this.closeAllWindows();

			// open empty window
			chrome.windows.create({});
		}
		// open ws
		else{
			// find clicked ws by id
			var ws = this._repo.findWsById(wsId);

			// change current ws
			_repo.current = ws;

			// close all windows
			this.closeAllWindows();

			// open window with ws tabs
			chrome.windows.create({"url":ws.tabs});
		}
	}

});