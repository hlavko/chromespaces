$(function() {
	updateList();

	$("#tabSave").hide();

	if (localStorage["openedWorkspace"] == undefined){
		$("#create").show();
		$("#close").hide();
	}
	else{
		$("#create").hide();
		$("#close").show();
	}


	$("#create").click(function() {
		$("#tabDefault").hide();
		$("#tabSave").show();
	});

	$("#close").click(function() {
		closeWorkspace();

		$("#create").show();
		$("#close").hide();
	});

	$('#submit').click(function() {
  		$("#tabDefault").show();
		$("#tabSave").hide();

		var name = $("#workspaceName").val();
		createWorkspace(name);
		
		$("#create").hide();
		$("#close").show();
	});
});

function updateList(){
	$("#list").html('');

	for (key in localStorage){
		if (key.indexOf("workspace_") != -1){

			var name = key.replace("workspace_", "");

			var item = $("<div id='" + name +"'>" + name +  "</div>");

			if (localStorage["openedWorkspace"] == name)
				item.addClass("opened");
			else{
				var openButton = $("<div>open</div>").click(function(){
					var name = $(this).parent().attr("id");
					openWorkspace(name);
				});

				item.append(openButton);
			}

			var removeButton = $("<div>remove</div>").click(function(){
				removeWorkspace(name);
			});

			item.append(removeButton);
			$("#list").append(item);
		}
	}
}

function openWorkspace(name){
	localStorage["openedWorkspace"] = name;

	closeAllWindows();

	var workspaceUrls = JSON.parse(localStorage["workspace_" + name]);
	chrome.windows.create({"url":workspaceUrls});
}

function createWorkspace(name){
	localStorage["openedWorkspace"] = name;

	saveCurrentWorkspace();
}

function saveCurrentWorkspace(){
	if (localStorage["openedWorkspace"] == undefined)
		return;

	var currentWorkspaceName = localStorage["openedWorkspace"];

	var openedTabsUrls = [];

	chrome.tabs.query({}, function(tabs){
		for (var i = 0; i < tabs.length; i++){
			openedTabsUrls.push(tabs[i].url);
		}

		localStorage["workspace_" + currentWorkspaceName] = JSON.stringify(openedTabsUrls);

		updateList();
	});
}

function removeWorkspace(name){
	delete localStorage["workspace_" + name];

	if (localStorage["openedWorkspace"] == name)
		closeWorkspace();

	updateList();
}

function closeWorkspace(){
	delete localStorage["openedWorkspace"];

	closeAllWindows();

	chrome.windows.create({});
}

function closeAllWindows(){
	chrome.windows.getAll({},function(windows){
		for (var i=0; i < windows.length; i++){
			chrome.windows.remove(windows[i].id);
		}
	});
}