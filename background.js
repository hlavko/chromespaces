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
});

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
	});
}