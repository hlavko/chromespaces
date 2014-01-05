$(function() {

	updateList();

	$("#tabSave").hide();

	$("#save").click(function() {
		$("#tabDefault").hide();
		$("#tabSave").show();
	});

	$('#submit').click(function() {
  		$("#tabDefault").show();
		$("#tabSave").hide();

		var name = $("#workspaceName").val();
		saveCurrentWorkspace(name);
		
	}); 
});

function updateList(){
	console.log(localStorage);
	$("#list").html('');

	for (key in localStorage){	
		if (key.indexOf("workspace_") != -1){

			var name = key.replace("workspace_", "");

			var item = $("<div>" + key.replace("workspace_", "") +  "</div>").click(function(){
				openWorkspace(name);
			});

			var removeButton = $("<div>remove</div>").click(function(){
				removeWorkspace(name);
			});

			item.append(removeButton);
			$("#list").append(item);
		}
	}
}

function openWorkspace(name){
	var workspaceUrls = localStorage["workspace_" + name].split(",")
	chrome.windows.create({"url":workspaceUrls});
}

function saveCurrentWorkspace(name){
	var openedTabsUrls = [];

	chrome.tabs.query({}, function(tabs){
		for (var i = 0; i < tabs.length; i++){
			openedTabsUrls.push(tabs[i].url);
		}

		localStorage["workspace_" + name] = openedTabsUrls;
	});
}

function removeWorkspace(name){
	delete localStorage["workspace_" + name];
	updateList();
}