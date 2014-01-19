/**
 * Application settings.
 * @param  {number} lastId			last used workspace identificator
 */
var Settings = Class.extend({

	/**
	 * Constructor.
	 */
	init: function(){
		this.lastId = 0;
	},

	/**
	 * Generate unique workspace identificator.
	 * @return {number}	unique workspace identificator.
	 */
	generateId: function(){
		return ++this.lastId;
	}

});