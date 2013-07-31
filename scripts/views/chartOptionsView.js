var ChartOptionsView = Backbone.View.extend({
    el: ".poll-chart-options",
    events: {
        "click #updatePreview": 'updatePreviewWindow',
        'change #pollMarker': 'updatePreviewWindow',
        'change #pollScale': 'updatePreviewWindow',
        'change #pollNeedle': 'updatePreviewWindow',
        'change #pollSpindle': 'updatePreviewWindow'
    },

    initialize: function()
    {
        _.bindAll(this, 'render');
        this.template = _.template( $("#poll-chart-options-template").html() );

        var self = this;

        Backbone.on('call-chartOptionsView', function(){
            console.log('chartOptionsView call');
            self.buildOptionsTemplateData(function(){
                self.render();
            });
        });

        this.on('rendered', function(){
            // Tooltips
            $("[data-toggle=tooltip]").tooltip("show");

            // Placeholders for input/textarea
            $("input, textarea").placeholder();

            // Switch
            $("[data-toggle='switch']").wrap('<div class="switch" />').parent().bootstrapSwitch();

            //tabs
            var gaugeTabs = $("#gaugeChart");
            $(".nav-tabs a:first", gaugeTabs).tab('show');
            $(".tab-content", gaugeTabs).show();
        });
    },

    /**
     * Build Options template data and display it
     */
    buildOptionsTemplateData: function(cb)
    {
        var gauge = this.global.chartOptionsModel.get('gauge')
          , element = this.global.chartOptionsModel.get('element')
          , wholeGaugeTabContent = "";

        //attach to the common elements if its ON or OFF
        $.each(element.common, function(index,value){
            switch(index)
            {
                case 'scale':
                    element.common[index].checked = (gauge.common[index].label.visible === true) ? 'checked="checked"' : '';
                break;
                default:
                    element.common[index].checked = (gauge.common[index].visible === true) ? 'checked="checked"' : '';
                break;
            }
        });

        //put data to another template that will build the bar TABS
        // var gaugeTabContent = $("#poll-chart-options-gaugeTab-template").html();
        // $.each(gauge.bars, function(index,value){
        //     var jsonData = {
        //         barIndex: index + 1,
        //         colorElement: element.bars.color,
        //         bgcolorElement: element.bars.backgroundColor,
        //         barColor: gauge.bars[index].color,
        //         barBgColor: gauge.bars[index].backgroundColor
        //     };

        //     wholeGaugeTabContent += _.template( gaugeTabContent )( jsonData );
        // });
        
        // //update gauge tab content
        // this.global.chartOptionsModel.set('barTabsContent', wholeGaugeTabContent);

        //update common content
        this.global.chartOptionsModel.set('element', element);
        
        //callback if any
        if (cb) cb();
    },

    /**
     * Render template to page
     */
    render: function()
    {
        $(this.el).html( this.template( this.global.chartOptionsModel.toJSON() ) );

        this.trigger('rendered');
    },

    /**
     * return the jquery object of a given id
     */
    elem: function( id )
    {
        return $("#" + id);
    },

    /**
     * Update preview poll
     */
    updatePreviewWindow: function(e)
    {
        // var el = $(e.target);
        var self = this;

        var gauge = this.global.chartOptionsModel.get('gauge')
          , element = this.global.chartOptionsModel.get('element');

        //get data from the tabs
        $.each(gauge.bars, function(index,value){

            //select the element
            var i = index + 1
              , colorValue = self.elem(element.bars.color + i).val()
              , bgcolorValue = self.elem(element.bars.backgroundColor + i).val();

            //update variable gauge
            gauge.bars[index].color = colorValue;
            gauge.bars[index].backgroundColor = bgcolorValue;
        });

        //get value for common settings
        $.each(element.common, function(index,value){

            var valBool = self.elem(value.id).is(":checked");

            switch(index)
            {
                case 'marker':
                case 'needle':
                case 'spindle':
                    gauge.common[index].visible = valBool;
                break;
                case 'scale':
                    gauge.common[index].label.visible = valBool;
                break;
            }
        });

        //update chart model
        this.global.chartOptionsModel.set('gauge', gauge);

        //draw chart
        this.global.previewChartView.drawPreviewChart();
    }
});