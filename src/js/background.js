/**
 * Background application script used for real-time saving
 * of application data and updating application icon.
 * Script is communicating with browser action scripts through
 * the message system.
 */

// app repository
var Background = Class.extend({
	init: function(repo, view){
		// create repository used in the application
		this.repo = new Repo();

		this.prepareListeners();
		this.prepareMessageListener();

		this.updateIcon();
	},

	/**
	 * Prepare listeners for all common actions which may point to application save.
	 */
	prepareListeners: function(){
		chrome.tabs.onCreated.addListener(function(tab){
			this.updateIcon();
			this.saveCurrentWorkspace();
		});

		chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
			this.updateIcon();
			this.saveCurrentWorkspace();
		});

		chrome.tabs.onRemoved.addListener(function(tabId, removeInfo){
			this.updateIcon();
			this.saveCurrentWorkspace();
		});

		chrome.windows.onCreated.addListener(function(window){
			this.updateIcon();
			this.saveCurrentWorkspace();
			chrome.windows.update(window.id,{state: "maximized"})
		});

		chrome.windows.onRemoved.addListener(function(windowId){
			this.updateIcon();
			this.saveCurrentWorkspace();
		});
	},

	/**
	 * Prepare message listener used for communicating with browser action scripts.
	 */
	prepareMessageListener: function(){
		chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
			if (request.type == "save"){
				this.updateIcon();
				this.saveCurrentWorkspace();
				return true;
			}
			else if(request.type == "load"){
				this.sendResponse({repo: this.repo});
			}
		});
	},

	/**
	 * Save changes in currently opened workspace to the application data.
	 */
	saveCurrentWorkspace: function(){
		if (!repo.current)
			return;

		chrome.tabs.query({}, function(tabs){
			repo.current.tabs = [];

			for (var i = 0; i < tabs.length; i++)
				repo.current.tabs.push(tabs[i].url);
			
			repo.save();
		});
	},

	/**
	 * Update browser action icon. Icon state has two states for opened or closed workspace.
	 * Opened workspace display also first letter of opened workspace.
	 */
	updateIcon: function(){
		if (this.repo.current){
			chrome.browserAction.setBadgeText({text: this.repo.current.name.charAt(0).toUpperCase()});
			chrome.browserAction.setBadgeBackgroundColor({color : "#dd4b39"});
			chrome.browserAction.setIcon({path: "images/active.png"});
		}
		else{
			chrome.browserAction.setBadgeText({text: ""});
			chrome.browserAction.setBadgeBackgroundColor({color : [0,0,0,0]});
			chrome.browserAction.setIcon({path: "images/inactive.png"});
		}
	}
});

// store background script in global memory
// with all stuff that is needed for chrome listener
// because their context is global
var bg = new Background()
repo = bg.repo;
updateIcon = bg.updateIcon;
saveCurrentWorkspace = bg.saveCurrentWorkspace;
