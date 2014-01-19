// application main script

$(function() {
	// hide item view
	$("#item-view").hide();

	// wait for background page loading
	chrome.runtime.getBackgroundPage(function(window){
		// show list view
		new ListController(window.repo);
	});
});