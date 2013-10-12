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
        //create model
        this.global.navigatorModel = new PollNavigatorModel();

        _.bindAll(this, 'render', 'ready');

        var self = this;
        this.navigatorModel = this.global.navigatorModel;

        this._elems = {
            questionSelect: "#questionList",      //object of the select element that holds the user form questions
            pollResults: "#poll-results",   //object of the poll result
            processPollBtn: "#proceedButton"      //object of the button
        };

        Backbone.on('call-pollNavigatorView', function(){
            // console.log('Navigator call');
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
        this.$el.html( renderTemplate('templates/pollNavigator.html', this.navigatorModel.toJSON() ) );

        return this;
    },

    /**
     * Process the entire Poll from the click event of a button
     * triggers everything from reading poll data to displaying
     * @param e - object of an event [click]
     */
    processPoll: function(e)
    {
        if ( !this.checkFormID() ) return false;
        if ( !this.checkQuestionIndex() ) return false;

        //proceed when eveything is clear
        if ( this.global.router.currentType === "generate" )
        {
            //remove any unused bars before generate the url data
            this.global.generateView.generate(this.formID, this.questionIndex);
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
        //reset question data and fill it later if valid
        this.setQuestion(false, false);

        //Check the picked question if valid or not
        // console.log(q);
        if ( this.global.pollDataModel.get('allowedControls').indexOf(q.type) == -1 )
        {
            alert("You selected an invalid type of question.\nOnly Dropdown, Radio, Star and Scale type of questions are accepted.");
            return false;
        }

        //count now, lets use the functin inside polldata model
        var self = this;
        this.global.pollDataModel.getQuestionPollData(q, function(response){
            var poll_count = (self.toArray(response.results.value)).length;
            // console.log("Poll count", poll_count);
            //dont allow more than 5 counts and below 2 counts
            if ( poll_count > 5 || poll_count < 2 ) {
                alert("We only support questions with atleast 2 options and no more than 5 options.");
                return false;
            } else {
                //set question id and title
                self.setQuestion(q.qid, q.text);

                //remove any unused bars, markers, tabs once a question is selected
                self.global.chartOptionsView.handle_Bars_Markers_total(poll_count);

                //modify the tabs, to only show specific tabs, depends on how many polls we have
                self.global.chartOptionsView.handleBarTabs(poll_count);
            }
            
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

                //set form ID and title
                self.setForm(selectedFormObj.id, selectedFormObj.title);

                //reset question data if form is selected
                self.setQuestion(false, false);

                self.global.generateView.clearURLArea();

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
    getQuestionSelected: function(e)
    {
        this.checkFormID();

        var self = this;
        JF.QuestionPicker(this.formID, {
            ignore_types: [
                "control_head", 
                "control_button", 
                "control_pagebreak", 
                "control_collapse", 
                "control_text"
            ],
            loadForm: false,
            onSelect : function(q) {
                if (q.length > 1) {
                    alert("You only required to select one question.\nPlease try again!");
                    return false;
                }

                var question = q[0];
                self.countPollOptions(question);
            }
        });
    },

    setForm: function(id, title)
    {
        this.formID = id;
        this.formTitle = title;

        // console.log("Form", this.formID, this.formTitle);
    },

    setQuestion: function(id, title)
    {
        this.questionIndex = id;
        this.questionName = title;

        // console.log("Question", this.questionIndex, this.questionName);
    },

    checkFormID: function()
    {
        if ( typeof this.formID === 'undefined' ) {
            alert('Form is missing, please select a form first!');
            return false;
        }
        return true;
    },

    checkQuestionIndex: function()
    {
        if (
            typeof this.questionIndex === 'undefined' ||
            (typeof this.questionIndex === 'boolean' && this.questionIndex == false)
        ){
            alert('Question is missing, please select a question first!');
            return false;
        }
        return true;
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