var PollNavigatorModel = Backbone.Model.extend({
    /**
     * Default values of the model
     * @type {Object}
     */
    defaults: {
        disableButton: 'disabled="disabled"'
    },
    /**
     * Constructor
     */
    initialize: function(options){
        Backbone.on('call-pollNavigatorModel', function(){
            // console.log("Poll Navigator Model call");
        });
    },

    resetDefaults: function()
    {
        var navDefault = this.defaults;
        this.set({
            hiddenClass: navDefault.hiddenClass
        });
    }
});
