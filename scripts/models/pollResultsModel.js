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
    initialize: function(){
        Backbone.on('call-pollResultsModel', function(){
            console.log("Poll results model call");
        });
    },

    /**
     * Initiate Poll results before displaying Data
     */
    initPollResults: function(formID, submissions)
    {
        var pollDataModel = this.global.pollDataModel;
        var pollDataRaw = pollDataModel.get('_pollData');

        //if poll Data abstract is not empty proceed otherwise generate
        if ( pollDataRaw.results.length > 0 )
        {
            pollDataModel.generatePollResults(submissions);
        }
        else
        {
            pollDataModel.getFormQuestions(formID, function(){
                pollDataModel.generatePollResults(submissions);
            });
        }
    },

    /**
     * Get form submission from a certain formID
     */
    getFormSubmissions: function(formID)
    {
        var self = this;

        //get all forms submissions
        JF.getFormSubmissions(String(formID), {
            offset: 0,
            limit: 1000
        }, function(submissions){
            self.initPollResults(formID, submissions);
        });
    }
});