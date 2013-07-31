var GenerateCodeView = Backbone.View.extend({
    el: ".poll-code-generator",

    initialize: function()
    {
        _.bindAll(this, 'render', 'generate');
        this.template = _.template( $("#poll-code-generator-template").html() );

        var self = this;

        Backbone.on('call-generateView', function(){
            console.log('Generator call');
            self.global.router.currentType = "generate";
            self.render();
        });
    },

    render: function()
    {
        //reset
        this.global.navigatorModel.resetDefaults();

        $(this.el).html( this.template );
    },

    generate: function(formID, questionID)
    {
        console.log('got it', formID, questionID);
        if ( !JF.getAPIKey() )
        {
            console.error('JotForm API Key is missiing, please re-authenticate.')
        }
        else
        {
            var formData = {
                form: Number(formID),
                question: Number(questionID),
                apiKey: String(JF.getAPIKey()), 
                chart: {
                    gauge: this.global.chartOptionsModel.get('gauge'),
                    hbars: ''
                }
            };
            var jsonFormData = JSON.stringify( formData );
            var encodedFormData = B64.encode(RawDeflate.deflate(jsonFormData.toString()));
            var generatedFormData = window.location.origin + window.base + "resultData/" + encodedFormData;
            $("#generatedFormData").val(generatedFormData);

            console.log('new', jsonFormData);
        }
    }
});