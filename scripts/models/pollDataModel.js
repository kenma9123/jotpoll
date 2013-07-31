var PollDataModel = Backbone.Model.extend({

    defaults: {
        _pollData: {
            results: {}
        },
        allowedControls: [
            'control_dropdown','control_radio',
            'control_rating','control_scale'
        ]
    },

    initialize: function()
    {
        Backbone.on('call-pollDataModel', function(){
            console.log("Poll data model call");
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
                if ( pollDataRaw.results[formID][questionIndex].value.hasOwnProperty(qAns) )
                {
                    //check if not a number
                    if ( pollDataRaw.results[formID][questionIndex].value[qAns] === "" )
                    {
                        pollDataRaw.results[formID][questionIndex].value[qAns] = 0;
                    }

                    //increment count
                    pollDataRaw.results[formID][questionIndex].value[qAns]++;
                }
            }
        }

        console.log( 'generated poll data', pollDataRaw );

        this.set('_pollData', pollDataRaw);

        this.pollResultsView.displayPollResults();
    },

    getFormQuestions: function(formIDopt, cb)
    {
        var self = this;
        var navigatorView = this.global.navigatorView;
        var pollDataModel = this.global.pollDataModel;
        var optionsTemplate = '<option value="{:value:}">{:text:}</option>';
        var optionsGenerated = "";

        var pollDataRaw = {
            results: {}
        };

        var formID = formIDopt || ( navigatorView && navigatorView.formID );

        JF.getFormQuestions(String(formID), function(e){
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

            pollDataRaw.results[formID] = {};

            for ( var i in e )
            {
                var question_index = i;
                var question_text = e[i].text;
                var question_type = e[i].type;
                
                //check if such control is allowed
                if ( self.get('allowedControls').indexOf(question_type) > -1 )
                {
                    //don't allow special options
                    if ( ( e[i].special && String(e[i].special).toLowerCase() === 'none' ) || !e[i].special )
                    {
                        pollDataRaw.results[formID][question_index] = {};
                        pollDataRaw.results[formID][question_index].value = {};
                        pollDataRaw.results[formID][question_index].name = question_text;

                        //register each control data to have an empty data
                        switch(question_type)
                        {
                            case 'control_dropdown':
                            case 'control_radio':
                                var q = String(e[i].options).split('|');
                                for( var x = 0; x < q.length; x++ ) {
                                    pollDataRaw.results[formID][question_index].value[q[x]] = 0;
                                }
                            break;
                            case 'control_rating':
                            case 'control_scale':
                                var counts = (question_type === 'control_rating') ? e[i].stars : e[i].scaleAmount;
                                for( var x = 1; x <= counts; x++ ) {
                                    pollDataRaw.results[formID][question_index].value[x] = 0;
                                }
                            break;
                        }

                        //print the options to the select element only if callback is given
                        optionsGenerated += optionsTemplate.replace(/\{\:value\:\}/, question_index).replace(/\{\:text\:\}/, question_text);
                    }
                    else
                    {
                        // alert("Sorry but this poll don't support special Options");
                    }
                }
            }

            //set poll Data
            pollDataModel.set('_pollData', pollDataRaw);
            if (cb) cb(optionsGenerated);
        });
    }
});