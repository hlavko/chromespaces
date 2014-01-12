$(function() {
	$("#item-view").hide();

	var repo = new Repo();
	new ListController(repo);

	console.log(repo.current, repo.all);

});