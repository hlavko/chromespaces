$(function() {
	chrome.tabs.onCreated.addListener(function(tab){
		saveCurrentWorkspace();
	});

	chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
		saveCurrentWorkspace();
	});

	chrome.tabs.onRemoved.addListener(function(tabId, removeInfo){
		saveCurrentWorkspace();
	});

	chrome.windows.onCreated.addListener(function(window){
		saveCurrentWorkspace();
		chrome.windows.update(window.id,{state: "maximized"})
	});

	chrome.windows.onRemoved.addListener(function(windowId){
		saveCurrentWorkspace();
	});

	chrome.runtime.onMessage.addListener(
	  function(request, sender, sendResponse) {
	    if (request.type == "save"){
	      saveCurrentWorkspace();
	      return true;
	    }
	});

	updateIcon();
});

function saveCurrentWorkspace(){
	updateIcon();

	if (localStorage["openedWorkspace"] == undefined)
		return;

	var currentWorkspaceName = localStorage["openedWorkspace"];

	var openedTabsUrls = [];

	chrome.tabs.query({}, function(tabs){
		for (var i = 0; i < tabs.length; i++){
			openedTabsUrls.push(tabs[i].url);
		}

		localStorage["workspace_" + currentWorkspaceName] = JSON.stringify(openedTabsUrls);
	});
}

function updateIcon(){
	if (localStorage["openedWorkspace"] == undefined)
		chrome.browserAction.setIcon({path: "inactive.png"});
	else
		chrome.browserAction.setIcon({path: "active.png"});
}