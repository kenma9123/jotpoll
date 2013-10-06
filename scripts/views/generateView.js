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
            // console.log('Generator call');
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
        // console.log('got it', formID, questionID);
        if ( !JF.getAPIKey() )
        {
            console.error('JotForm API Key is missiing, please re-authenticate.')
        }
        else
        {
            this.defaults.isDisabled = '';
            this.render();

            var poll = this.global.chartOptionsModel.get('poll');
            var settings = {
                type: poll.type,
                common: {
                    scale: poll.common.scale.label.visible,
                    marker: poll.common.marker.visible
                }
            };

            //get bars
            var bars = [];
            _.each(poll.bars, function(value, key){
                bars[key] = {};
                bars[key].color = value.color;
                bars[key].bgcolor = value.backgroundColor;
            });

            settings.bars = bars;
            console.log(settings);

            $.ajax({
                url: 'server.php',
                type: 'POST',
                data: {
                    action: 'saveSettings',
                    formID: String(formID),
                    questionID: String(questionID),
                    settings: settings
                },
                success: function(response)
                {
                    console.log(response);
                    // console.log("RAW", formData);
                    // var jsonFormData = JSON.stringify( formData );
                    // var encodedFormData = B64.encode(RawDeflate.deflate(jsonFormData.toString()));
                    var generatedFormData = window.location.origin + window.base + "result/" + response.result.unique_id;
                    $("#generatedFormData", this.$el).val(generatedFormData);

                },
                error: function(errors)
                {
                    console.error(errors);
                }
            });

            // console.log('new', jsonFormData);
        }
    },

    clearURLArea: function()
    {
        $("#generatedFormData", this.$el).attr('disabled','disabled').val('');
    },

    initClip: function()
    {
        // console.log('clip');
        var clip = $("#copyToClipboard")
          , clipOriText = clip.text();

        clip.zclip({
            path: "scripts/lib/clipboard/ZeroClipboard.swf",
            copy: function(){
                if ( !$(this).is(':disabled') )
                {
                    return $(this).siblings('#generatedFormData').val();
                }
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
        // console.log(generatedUrl);
        $(e.target).attr('href', generatedUrl);
    }
});