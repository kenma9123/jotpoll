var CreatePollView = Backbone.View.extend({

	initialize: function()
	{
		//create model
		this.global.createPollModel = new CreatePollModel();
	}

});