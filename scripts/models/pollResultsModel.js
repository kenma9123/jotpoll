var PollResultsModel = Backbone.Model.extend({
    /**
     * Default values of the model
     * @type {Object}
     */
    defaults: {
        graphTitleData: '',
        graphData: '',
        chartPollElement: '',
        pollTitle: '',
        legends: {}
    },

    /**
     * Constructor
     */
    initialize: function()
    {
        Backbone.on('call-pollResultsModel', function(){
            // console.log("Poll results model call");
        });
    }
});