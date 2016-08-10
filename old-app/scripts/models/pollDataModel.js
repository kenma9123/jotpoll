var PollDataModel = Backbone.Model.extend({

    defaults: {
        _pollData: {
            results: {}
        },
        total_polls: 0,
        allowedControls: [
            'control_dropdown','control_radio',
            'control_rating','control_scale'
        ]
    },

    initialize: function()
    {
        Backbone.on('call-pollDataModel', function(){
            // console.log("Poll data model call");
        });
    },

    /**
     * Generate the Poll Results Data from the submissions of the form
     * and the selected question to be displayed on the Poll
     * @param submissions - submissions of the form
     */
    generatePollResults: function(submissions)
    {
        this.pollResultsView = this.global.resultsView;

        var pollDataRaw = this.get('_pollData');
        var formID = this.pollResultsView.formID;
        var questionIndex = this.pollResultsView.questionIndex;

        for ( var i in submissions )
        {
            var answers = submissions[i].answers;

            //check if the selected question is included in the answers of each submission
            if ( answers[questionIndex] && answers[questionIndex].answer )
            {
                var qAns = answers[questionIndex].answer;

                //check wheter the qAns property is existed inside the object
                if ( pollDataRaw.results.value.hasOwnProperty(qAns) )
                {
                    //check if not a number
                    if ( pollDataRaw.results.value[qAns] === "" )
                    {
                        pollDataRaw.results.value[qAns] = 0;
                    }

                    //increment count
                    pollDataRaw.results.value[qAns]++;
                }
            }
        }

        // console.log( 'generated poll data', pollDataRaw );

        this.set('_pollData', pollDataRaw);

        this.pollResultsView.displayPollResults();
    },

    getQuestionPollData: function(questionObj, next)
    {
        var self = this;

        var pollDataRaw = {
                results: {}
            }
          , q = questionObj
          , question_index = q.qid
          , question_type = q.type;

        // console.log(q);
        //init poll result properties
        //register it to the pollData results array
        // this will result to
        // {
        //     name: 'control_name',
        //     value: {
        //         'Options1': "",
        //         'Options2': ""
        //     }
        // }



        pollDataRaw.results = {
            value: {},
            name: q.text
        };
        
        //don't allow special options
        if ( ( q.special && String(q.special).toLowerCase() === 'none' ) || !q.special )
        {
            //register each control data to have an empty data
            switch(question_type)
            {
                case 'control_dropdown':
                case 'control_radio':
                    var q = String(q.options).split('|');
                    for( var x = 0; x < q.length; x++ ) {
                        pollDataRaw.results.value[q[x]] = 0;
                    }
                break;
                case 'control_rating':
                case 'control_scale':
                    var counts = (question_type === 'control_rating') ? q.stars : q.scaleAmount;
                    for( var x = 1; x <= counts; x++ ) {
                        pollDataRaw.results.value[x] = 0;
                    }
                break;
            }
        }
        else
        {
            // alert("Sorry but this poll don't support special Options");
        }

        //set poll Data
        self.set('_pollData', pollDataRaw);

        if (next) next(pollDataRaw);
    }
});