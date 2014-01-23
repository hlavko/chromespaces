/**
 * Workspace item view controller manages fundamental workspace-based actions.
 * @param  {Workspace} 		_ws 					workspace which is representing by this item
 * @param  {ListController} _list 					list controller back reference
 */
var ItemController = Controller.extend({

	/**
	 * Constructor.
	 * @param  {Repo} 			repo 		application repository
	 * @param  {Workspace} 		ws 			workspace which is representing by this item
	 * @param  {ListController} list 		list controller back reference
	 */
	init: function(repo, ws, list){
		this._super(repo, $("#item-view"));
		this._ws = ws;
		this._list = list;

		this.toggle(true);
		this.prepare();
	},

	/**
	 * Add this workspace item to the application data.
	 */
	add: function(){
		this._ws.name = $("#ws-name").val();
		this._repo.add(this._ws);

		chrome.runtime.sendMessage({type: "save"});

		this.cancel();
		
		window._gaq.push(['_trackEvent', 'add workspace', 'click']);
	},

	/**
	 * Cancel without save editing of this item.
	 */
	cancel: function(){
		this.toggle(false);
		this._list.update();
		this._list.toggle(true);
		this.dispose();
	},

	/**
	 * Close this workspace.
	 */
	close: function(){
		this._list.close(this._ws);
		this.cancel();
	},

	/**
	 * Dispose all bindings.
	 */
	dispose: function(){
		$("#save-button").unbind('click');
		$("#remove-button").unbind('click');
		$("#close-button").unbind('click');
		$("#open-button").unbind('click');
		$("#add-button").unbind('click');
		$("#cancel-button").unbind('click');
	},

	/**
	 * Open this workspace.
	 */
	open: function(){
		this._list.open(this._ws);
		this.cancel();
	},

	/**
	 * Attach listeners and prepare item display.
	 */
	prepare: function(){
		// unbind everything and prepare visibility
		$("#add-button").hide().unbind();
		$("#save-button").hide().unbind();
		$("#open-button").hide().unbind();
		$("#close-button").hide().unbind();
		$("#remove-button").hide().unbind();
		$("#info-tabs").show().unbind();
		$("#info-last").show().unbind();
		$("#info-times").show().unbind();
		$("#item-view table tbody .tab-url").remove();

		// set workspace name to input
		$("#ws-name").val(this._ws.name);
		$("#ws-name").focus().unbind();

		// prepare visual and bindings of workspace
		if (this._ws.timesOpened > 0){
			// workspace is fully controllable because it is already stored in the application data
			$("#save-button").show();
			$("#remove-button").show();

			$("#save-button").bind('click', {controller: this}, function(event){
				event.data.controller.save();
			});

			$("#ws-name").bind('keypress', {controller: this}, function(event){
				if (event.which == 13)
					event.data.controller.save();
			});

			$("#remove-button").bind('click', {controller: this}, function(event){
				event.data.controller.remove();
			});

			// set open/close visual based on current workspace state
			if (this._repo.isCurrent(this._ws)){
				$("#close-button").show();

				$("#close-button").bind('click', {controller: this}, function(event){
					event.data.controller.close();
				});
			}
			else{
				$("#open-button").show();

				$("#open-button").bind('click', {controller: this}, function(event){
					event.data.controller.open();
				});
			}

			var date = this._ws.last;
			var formattedDate = date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
			$("#info-last td:eq(1)").text(formattedDate);
			
			$("#info-times td:eq(1)").text(this._ws.timesOpened);

			$("#info-tabs td:eq(1)").text(this._ws.tabs.length);

			var tBody = $("#item-view table tbody");
			for (var i = 0; i < this._ws.tabs.length; i++){
				tBody.append('<tr class="tab-url"><td colspan="2">' + this._ws.tabs[i] + '</td></tr>');
			}
		}
		else{
			// prepare save form of new workspace (because it is not saved in application data yet)
			$("#info-tabs").hide();
			$("#info-last").hide();
			$("#info-times").hide();

			$("#add-button").show();

			$("#add-button").bind('click', {controller: this}, function(event){
				event.data.controller.add();
			});

			$("#ws-name").bind('keypress', {controller: this}, function(event){
				if (event.which == 13)
					event.data.controller.add();
			});
		}

		$("#cancel-button").bind('click', {controller: this}, function(event){
			event.data.controller.cancel();
		});
	},

	/**
	 * Remove workspace from application.
	 */
	remove: function(){
		if (this._repo.isCurrent(this._ws))
			this._list.close(this._ws);

 		this._repo.remove(this._ws);

 		chrome.runtime.sendMessage({type: "save"});

 		this.cancel();

 		window._gaq.push(['_trackEvent', 'remove workspace', 'click']);
	},

	/**
	 * Save changed data of workspace.
	 */
	save: function(){
		this._ws.name = $("#ws-name").val();
		this._repo.save();
		this.cancel();
	},

});