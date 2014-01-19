/**
 * Base controller used for controlling application view.
 * @param  {Repo} 	_repo 			application repository
 * @param  {object} _view 			html element representing part of the application view
 */
var Controller = Class.extend({

	/**
	 * Constructor.
	 * @param  {Repo} 	repo 		app repo
	 * @param  {object} view 		html element
	 */
	init: function(repo, view){
		this._repo = repo;
		this._view = view;
	},

	/**
	 * Toggle on/off view.
	 * @param  {Boolean} value 		toggle view on or off ?
	 */
	toggle: function(value){
		value ? this._view.show() : this._view.hide();
	}

});