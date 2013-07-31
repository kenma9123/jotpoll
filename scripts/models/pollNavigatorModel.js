var PollNavigatorModel = Backbone.Model.extend({
    /**
     * Default values of the model
     * @type {Object}
     */
    defaults: {
        formsOptions: '<option value="none">Loading Forms...</option>',
        questionOptions: '<option value="none">No Questions Available</option>',
        disableButton: 'disabled="disabled"'
    },
    /**
     * Constructor
     */
    initialize: function(options){
        Backbone.on('call-pollNavigatorModel', function(){
            console.log("Poll Navigator Model call");
        });
    },

    resetDefaults: function()
    {
        var navDefault = this.defaults;
        this.set({
            formsOptions: navDefault.formsOptions,
            questionOptions: navDefault.questionOptions,
            hiddenClass: navDefault.hiddenClass
        });
    },

    getUserForms: function(cb)
    {
        var self = this;
        var optionsTemplate = '<option value="{:value:}">{:text:}</option>\n';
        var optionsGenerated = "";
        JF.getForms(function(e){
            // var e = self.temp();
            console.log(e);
            for ( var i in e )
            {
                var value = e[i].id;
                var text = e[i].title;
                var options = optionsTemplate.replace(/\{\:value\:\}/, value).replace(/\{\:text\:\}/, text);
                optionsGenerated += options;
            }
            if(cb) cb(optionsGenerated);
        });
    }
});
