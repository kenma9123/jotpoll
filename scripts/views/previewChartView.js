var PreviewChartView = Backbone.View.extend({
    el: ".poll-chart-preview",
    initialize: function()
    {
        _.bindAll(this, 'render');
        this.template = _.template( $("#poll-chart-preview-template").html() );

        var self = this;

        self.chartElemSelector = ".chart-preview-area";

        this.on('rendered', function(){
            // this.buildPreviewData();
            this.drawPreviewChart();
        });

        Backbone.on('call-chartPreview', function(){
            console.log('chartPreview call');
            self.render();
        });
    },

    render: function()
    {
        $(this.el).html( this.template );

        this.trigger('rendered', this);
    },

    /**
     * Build initial preview data
     * from preview model to chart model
     */
    buildPreviewData: function()
    {
        //get the default gauge
        var gauge = this.global.chartOptionsModel.get('gauge')
          , element = this.global.chartOptionsModel.get('element');

        //default bars that will only be displayed on PREVIEW
        // var gaugeBarsData = this.global.previewChartModel.get('bars');

        // //modify the gauge model using the preview data model
        // $.each(gauge.bars, function(index, value){

        //     //modify value to be displayed later on the preview chart
        //     gauge.bars[index].value = gaugeBarsData[index].value;

        //     //modify the offset to be displayed later on the preview chart
        //     gauge.bars[index].offset = gaugeBarsData[index].offset;

        //     //modify the text indent to be displayed later on the preview chart
        //     gauge.bars[index].text.indent = gaugeBarsData[index].indent;
        // });

        //get value for common settings
        //default common that will only be displayed on PREVIEW
        // var commonDefault = this.global.previewChartModel.get('common');

        // $.each(element.common, function(index,value){
        //     switch(index)
        //     {
        //         case 'marker':
        //         case 'needle':
        //         case 'spindle':
        //             gauge.common[index].visible = commonDefault[index].visible;
        //         break;
        //         case 'scale':
        //             gauge.common[index].label.visible = commonDefault[index].label.visible;
        //         break;
        //     }
        // });

        //update gauge
        this.global.chartOptionsModel.set('gauge', gauge);

        //draw chart
        this.drawPreviewChart();
    },

    /**
     * Draw the preview chart
     */
    drawPreviewChart: function()
    {
        var self = this
          , gauge = this.global.chartOptionsModel.get('gauge');
          
        this.global.drawChartView.setupGaugeChart(function(){
            $(self.chartElemSelector).remove();
            $("<div />").addClass("chart-preview-area").appendTo(".chart-preview");
            $(self.chartElemSelector).dxCircularGauge({
                preset: "preset3",
                scale: gauge.common.scale,
                spindle: gauge.common.spindle,
                rangeContainer: { backgroundColor: "none" },
                commonRangeBarSettings: gauge.commonRangeBarSettings,
                needles: gauge.needles,
                markers: gauge.markers,
                rangeBars: gauge.bars
            });
        });
    }
});