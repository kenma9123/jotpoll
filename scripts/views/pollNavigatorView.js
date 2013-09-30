var PollNavigatorView = Backbone.View.extend({
    el: ".poll-navigator",
    events:
    {
        'click #pickFormWidget': 'getFormSelected',
        'click #pickQuestionWidget': 'getQuestionSelected',
        'click #proceedButton': 'processPoll'
    },

    initialize: function()
    {
        _.bindAll(this, 'render', 'ready');

        var self = this;
        this.navigatorModel = this.global.navigatorModel;

        this._elems = {
            questionSelect: "#questionList",      //object of the select element that holds the user form questions
            pollResults: "#poll-results",   //object of the poll result
            processPollBtn: "#proceedButton"      //object of the button
        };

        //render template
        this.template = _.template( $("#poll-navigator-template").html() );

        Backbone.on('call-pollNavigatorView', function(){
            console.log('Navigator call');
            self.ready();
        });
    },

    ready: function()
    {
        var self = this;

        this.render();
    },

    render: function()
    {
        this.$el.html( this.template( this.navigatorModel.toJSON() ) );

        return this;
    },

    /**
     * Process the entire Poll from the click event of a button
     * triggers everything from reading poll data to displaying
     * @param e - object of an event [click]
     */
    processPoll: function(e)
    {
        this.checkFormID();
        this.checkQuestionIndex();

        var self = this;

        //proceed when eveything is clear
        if ( this.global.router.currentType === "generate" )
        {
            //remove any unused bars before generate the url data
            this.global.chartOptionsView.removeUnusedBars_Markers(function(){
                console.log("Removed unused bars", self.global.chartOptionsModel.get('poll'));
                self.global.generateView.generate(self.formID, self.questionIndex);

                //update the preview as well
                self.global.chartOptionsView.updatePreviewWindow();
            });
        }
        else
        {
            this.global.resultsView.processPoll(this.formID, this.questionIndex);
        }
    },

    /**
     * count how many options for the queston
     */
    countPollOptions: function(q)
    {
        //Check the picked question if valid or not
        console.log(q);
        if ( this.global.pollDataModel.get('allowedControls').indexOf(q.type) == -1 )
        {
            alert("You selected an invalid type of question.\nOnly Dropdown, Radio, Star and Scale type of questions are accepted.");
        }

        //count now, lets use the functin inside polldata model
        var self = this;
        this.global.pollDataModel.getQuestionPollData(q, function(response){
            var poll_count = (self.toArray(response.results.value)).length;

            //dont allow more than 5 counts and below 2 counts
            if ( poll_count > 5 || poll_count < 2 ) {
                alert("We only support questions with atleast 2 options and no more than 5 options.");
                return false;
            } else {
                //set how many polls we have to draw later
                self.global.pollDataModel.set('total_polls', poll_count);
            }
            console.log("Poll count", poll_count);
        });
    },

    /**
     * Get the Form properties of selected form
     * such as the formID and the formTitle
     * @param e - object of an event [change]
     */
    getFormSelected: function(e, cb)
    {
        var self = this;

        JF.FormPicker({
            multiSelect: false,
            showPreviewLink: true,
            title: 'Pick your Form where questions will be coming from',
            onSelect: function(r)
            {
                var selectedFormObj = r[0];

                //set form ID
                self.formID = selectedFormObj.id;

                //set form title
                self.formTitle = selectedFormObj.title;

                console.log(self.formID, self.formTitle);

                //re-disable proceed button
                self.navigatorModel.set({
                    disableButton: self.navigatorModel.defaults.disableButton
                });

                if (cb) cb.call(self);
            }
        });
    },

    /**
     * Get the Question properties of the selected question
     * such as the questionIndex and the questionName
     * @param e - object of an event [change]
     */
    getQuestionSelected: function(e, cb)
    {
        this.checkFormID();

        var self = this;
        JF.QuestionPicker(this.formID, {
            onSelect : function(q) {
                if (q.length > 1) {
                    alert("You only required to select one question.\nPlease try again!");
                    return false;
                }

                var question = q[0];
                self.questionIndex = question.qid;
                self.questionName = question.text;

                if (cb) {
                    cb.call(self, question);
                } else {
                    self.countPollOptions(question);
                }
            }
        });
    },

    checkFormID: function()
    {
        if ( typeof this.formID === 'undefined' ) {
            alert('Form is missing, please select a form first!');
            return false;
        }
    },

    checkQuestionIndex: function()
    {
        if ( typeof this.questionIndex === 'undefined' ) {
            alert('Question is missing, please select a question first!');
            return false;
        }
    },

    toArray: function(obj)
    {
        var arr =[];
        for( var i in obj ) {
            if (obj.hasOwnProperty(i)){
               arr.push(obj[i]);
            }
        }
        return arr;
    }
});