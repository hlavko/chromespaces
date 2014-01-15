var repo;

$(function() {
	repo = new Repo();

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

	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
		if (request.type == "save"){
			saveCurrentWorkspace();
			return true;
		}
		else if(request.type == "load"){
			sendResponse({repo: repo});
		}
	});

	updateIcon();
});

function saveCurrentWorkspace(){
	updateIcon();

	if (!repo.current)
		return;

	chrome.tabs.query({}, function(tabs){
		repo.current.tabs = [];

		for (var i = 0; i < tabs.length; i++)
			repo.current.tabs.push(tabs[i].url);
		
		repo.save();
	});
}

function updateIcon(){
	if (repo.current){
		chrome.browserAction.setBadgeText({text: repo.current.name.charAt(0).toUpperCase()});
		chrome.browserAction.setBadgeBackgroundColor({color : "#dd4b39"});
		chrome.browserAction.setIcon({path: "images/active.png"});
	}
	else{
		chrome.browserAction.setBadgeText({text: ""});
		chrome.browserAction.setBadgeBackgroundColor({color : [0,0,0,0]});
		chrome.browserAction.setIcon({path: "images/inactive.png"});
	}

	
}