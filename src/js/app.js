// application main script

// initialize tracking
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-47407483-1']);
_gaq.push(['_trackPageview']);
_gaq.push(['_trackEvent', 'open extension', 'click']);

(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = 'https://ssl.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

$(function() {
	// hide item view
	$("#item-view").hide();

	// wait for background page loading
	chrome.runtime.getBackgroundPage(function(window){
		// show list view
		new ListController(window.repo);
	});
});

