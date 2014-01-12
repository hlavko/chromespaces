$(function() {
	updateList();
	updateMenu();

	$("#tabSave").hide();

	$("#create a").click(function() {
		$("#tabDefault").hide();
		$("#tabSave").show();
	});

	$('#submit').click(function() {
  		$("#tabDefault").show();
		$("#tabSave").hide();

		var name = $("#workspaceName").val();
		createWorkspace(name);
		
		$("#create").hide();
	});
});

function updateMenu(){
	if (localStorage["openedWorkspace"] == undefined)
		$("#create").show();
	else
		$("#create").hide();
}

function updateList(){
	$("#list tbody").html('');

	for (key in localStorage){
		if (key.indexOf("workspace_") != -1){

			var name = key.replace("workspace_", "");

			var row = $("<tr id='" + name + "'></tr>");
			var colName = $("<td>" + name +  "</td>");
			row.append(colName);

			if (localStorage["openedWorkspace"] == name){
				row.addClass("opened");

				var closeCol = $("<td><a href='javascript:void(0)'>close</a></td>").click(function(){
					closeWorkspace();
				});

				row.append(closeCol);
			}
			else{
				var openCol = $("<td><a href='javascript:void(0)'>open</a></td>").click(function(){
					var name = $(this).parent().attr("id");
					openWorkspace(name);
				});

				row.append(openCol);
			}

			var removeCol= $("<td><a href='javascript:void(0)'>remove</a></td>").click(function(){
				var name = $(this).parent().attr("id");
				removeWorkspace(name);
			});

			row.append(removeCol);

			var tabsCount = JSON.parse(localStorage[key]).length;
			var tabsCol = $("<td>" + tabsCount + "</td>");
			row.append(tabsCol);

			$("#list tbody").append(row);
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

	chrome.runtime.sendMessage({type: "save"}, function(response) {
  		console.log(response)
	});

	updateList();
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

function updateIcon(){
	if (localStorage["openedWorkspace"] == undefined)
		chrome.browserAction.setIcon({path: "inactive.png"});
	else
		chrome.browserAction.setIcon({path: "active.png"});
}