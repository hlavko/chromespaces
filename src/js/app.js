$(function() {
	$("#item-view").hide();

	chrome.runtime.getBackgroundPage(function(window){
		new ListController(window.repo);
	});
});