var GenerateCodeView = Backbone.View.extend({
    el: ".poll-code-generator",
    events: {
        'click #visitLinkButton': 'visitResultData'
    },

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

        this.on('rendered', function(){
            this.initClip();
        });

        self.defaults = {
            isDisabled: 'disabled="disabled"'
        };
    },

    render: function()
    {
        $(this.el).html( this.template( this.defaults ) );

        this.trigger('rendered', this);
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
            this.defaults.isDisabled = '';
            this.render();

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
    },

    initClip: function()
    {
        console.log('clip');
        var clip = $("#copyToClipboard")
          , clipOriText = clip.text();

        clip.zclip({
            path: "scripts/lib/clipboard/ZeroClipboard.swf",
            copy: function(){
                return $(this).siblings('#generatedFormData').val();
            },
            afterCopy: function(){
                var c = $(this);
                c.text('Copied').attr('disabled', 'disabled').prev().select();
                setTimeout(function(){
                    c.text(clipOriText).removeAttr('disabled');
                }, 2000);
            }
        });
    },

    visitResultData: function(e)
    {
        var generatedUrl = $(e.target).siblings('#generatedFormData').val();
        if ( !generatedUrl ) return false;
        console.log(generatedUrl);
        $(e.target).attr('href', generatedUrl);
    }
});