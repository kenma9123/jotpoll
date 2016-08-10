var CreatePollModel = Backbone.Model.extend({

    defaults: {
        question_title: "",
        min_answers: 2,
        max_answers: 5,
        total_answers: 0,
        answers: []
    },

    initialize: function()
    {

    }

});