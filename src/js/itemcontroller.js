var ItemController = Controller.extend({

	init: function(repo, ws, list){
		this._super(repo, $("#item-view"));
		this._ws = ws;
		this._list = list;

		this.toggle(true);
		this.prepare();
	},

	add: function(){
		this._ws.name = $("#ws-name").val();
		this._repo.add(this._ws);

		chrome.runtime.sendMessage({type: "save"});

		this.cancel();
	},

	cancel: function(){
		this.toggle(false);
		this._list.update();
		this._list.toggle(true);
		this.dispose();
	},

	close: function(){
		this._list.close(this._ws);
		this.cancel();
	},

	dispose: function(){
		$("#save-button").unbind('click');
		$("#remove-button").unbind('click');
		$("#close-button").unbind('click');
		$("#open-button").unbind('click');
		$("#add-button").unbind('click');
		$("#cancel-button").unbind('click');
	},

	open: function(){
		this._list.open(this._ws);
		this.cancel();
	},

	prepare: function(){
		$("#add-button").hide();
		$("#save-button").hide();
		$("#open-button").hide();
		$("#close-button").hide();
		$("#remove-button").hide();

		$("#info-tabs").show();
		$("#info-last").show();
		$("#info-times").show();

		// set workspace name to input
		$("#ws-name").val(this._ws.name);

		// add listeners
		if (this._ws.timesOpened > 0){
			$("#save-button").show();
			$("#remove-button").show();

			$("#save-button").bind('click', {controller: this}, function(event){
				event.data.controller.save();
			});

			$("#remove-button").bind('click', {controller: this}, function(event){
				event.data.controller.remove();
			});

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

			$("#info-tabs td:eq(1)").text(this._ws.tabs.length);

			var date = this._ws.last;
			var formattedDate = date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
			$("#info-last td:eq(1)").text(formattedDate);
			
			$("#info-times td:eq(1)").text(this._ws.timesOpened);
		}
		else{
			$("#info-tabs").hide();
			$("#info-last").hide();
			$("#info-times").hide();

			$("#add-button").show();

			$("#add-button").bind('click', {controller: this}, function(event){
				event.data.controller.add();
			});
		}

		$("#cancel-button").bind('click', {controller: this}, function(event){
			event.data.controller.cancel();
		});
	},

	remove: function(){
		if (this._repo.isCurrent(this._ws))
			this._list.close(this._ws);

 		this._repo.remove(this._ws);

 		chrome.runtime.sendMessage({type: "save"});

 		this.cancel();
	},

	save: function(){
		this._ws.name = $("#ws-name").val();
		this._repo.save();
		this.cancel();
	}

});