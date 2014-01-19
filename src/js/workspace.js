/**
 * Workspace project model representing one workspace created in the Chromespaces.
 * 
 * @param  {string} id 				unique workspace indentificator
 * @param  {string} name 			workspace name
 * @param  {Array} 	tabs 			array of opened tabs in workspace (array of strings)
 * @param  {Date} 	last 			datetime of last workspace opening
 * @param  {number} timesOpened 	workspace openings number
 */
var Workspace = Class.extend({

	/**
	 * Constructor.
	 * @param  {string} id
	 * @param  {string} name
	 * @param  {Array} 	tabs
	 * @param  {Date} 	last
	 * @param  {int} 	timesOpened
	 */
	init: function(id, name, tabs, last, timesOpened){
		this.id = id;
		this.name = name;
		this.tabs = tabs;
		this.last = last;
		this.timesOpened = timesOpened;
	},

	/**
	 * Add new tab to collection.
	 * @param {string} tabs
	 */
	addTabs: function(tabs){
		this.tabs = tabs;
	},

	/**
	 * Save information about last workspace opening.
	 */
	open: function(){
		this.timesOpened += 1;
		this.last = new Date();
	}

});