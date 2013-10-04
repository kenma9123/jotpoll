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
    },

    /**
     * Initiate Poll results before displaying Data
     */
    initPollResults: function(formID, submissions)
    {
        var pollDataModel = this.global.pollDataModel;
        var pollDataRaw = pollDataModel.get('_pollData');

        //get the question object
        var formID = this.global.resultsView.formID
          , questionIndex = this.global.resultsView.questionIndex;

        JF.getFormQuestion(formID, questionIndex, function(qobj){
            //now generate the poll data that will be use later on drawing the chart
            pollDataModel.getQuestionPollData(qobj, function(pollData){
                //after getting the poll data lets now generate the poll, fill the data
                pollDataModel.generatePollResults(submissions);
            });
        });
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
            // console.log("REad submissions", submissions);
            self.initPollResults(formID, submissions);
        });
    }
});