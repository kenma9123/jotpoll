var PollNavigatorView = Backbone.View.extend({
    el: ".poll-navigator",
    events:
    {
        'click #pickFormWidget': 'getFormSelected',
        'change #questionList': 'getQuestionSelected',
        'click #proceedButton': 'processPoll'
    },

    initialize: function()
    {
        _.bindAll(this, 'render', 'ready');

        var self = this;
        this.navigatorModel = this.global.navigatorModel;

        this._elems = {
            formSelect: "#formsList",             //object of the select element that holds the user forms
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

        //get user forms
        this.navigatorModel.getUserForms(function(response){
            self.renderUserForms(response);
        });

        this.navigatorModel.bind('change', _.bind(this.render, this));
    },

    render: function()
    {
        this.$el.html( this.template( this.navigatorModel.toJSON() ) );

        if ( typeof this.formID !== 'undefined' )
        {
            $(this._elems.formSelect).val(this.formID);
        }

        return this;
    },

    /**
     * Process the entire Poll from the click event of a button
     * triggers everything from reading poll data to displaying
     * @param e - object of an event [click]
     */
    processPoll: function(e)
    {
        var self = this;

        self.getFormID(function(){
            this.getQuestionIndex(function(){
                if ( this.global.router.currentType === "generate" )
                {
                    this.global.generateView.generate(this.formID, this.questionIndex);
                }
                else
                {
                    this.global.resultsView.processPoll(this.formID, this.questionIndex);
                }
            });
        });
    },

    renderFormQuestions: function()
    {
        var self = this;
        // var selectElem = self._elems.questionSelect;
        // selectElem.parent().fadeIn();
        $(self._elems.questionSelect).parent().fadeIn();
        // console.log(self._elems.questionSelect.parent().html());

        self.global.pollDataModel.getFormQuestions(null, function(questionOptions){
            console.log('edited', self.global.pollDataModel.get('_pollData'));
            self.navigatorModel.set({
                questionOptions: questionOptions,
                disableButton: ''
            });
        });

    },

    renderUserForms: function(formsOptions)
    {
        var options = "<option value='none'>Select a form</option>\n" + formsOptions;
        // console.log(this.navigatorModel, options);
        this.navigatorModel.set('formsOptions', options);
    },

    /**
     * Get the Form properties of selected form
     * such as the formID and the formTitle
     * @param e - object of an event [change]
     */
    getFormSelected: function(e,cb)
    {
        var self = this;
        var form = $( (e && e.target) || this._elems.formSelect );

        JFWidgets.FormPicker({
            multiSelect: false,
            onSelect: function(r) {
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

                if ( typeof cb !== 'undefined' ) {
                    cb.call(self);
                } else {
                    self.renderFormQuestions();
                }
            },
            onProgress: function() {
                console.log('Fetching user forms');
            }
        });
    },

    /**
     * Get the Question properties of the selected question
     * such as the questionIndex and the questionName
     * @param e - object of an event [change]
     */
    getQuestionSelected: function(e,cb)
    {
        var question = $( (e && e.target) || this._elems.questionSelect );

        //set question ID/Index
        this.questionIndex = question.val();

        //set question name
        this.questionName = question.find(":selected").text();

        if ( typeof cb !== 'undefined' ) {
            cb.call(this);
        }
    },

    /**
     * Get the form ID directly
     */
    getFormID: function(cb)
    {
        var id = null;
        if ( this.formID ) {
            id = this.formID;
        } else {
            this.getFormSelected(null, function(){
                id = this.formID;
            });
        }

        if (cb) cb.call(this,id);
        else return id;
    },

    /**
     * Get the question Index directly
     */
    getQuestionIndex: function(cb)
    {
        var index = null;
        if ( this.questionIndex ) {
            index = this.questionIndex;
        } else {
            this.getQuestionSelected(null, function(){
                index = this.questionIndex;
            });
        }

        if (cb) cb.call(this,index);
        else return index;
    },

    pickFormWidget: function()
    {
        JFWidgets.FormPicker({
            sort: 'count',
            multiSelect: false,
            onSelect: function(selectedForms) {

            },
            onProgress: function() {

            }
        });
    }
});