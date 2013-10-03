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
            // this.drawPreviewChart();
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
        //get the default poll
        var poll = this.global.chartOptionsModel.get('poll')
          , element = this.global.chartOptionsModel.get('element');

        //update poll
        this.global.chartOptionsModel.set('poll', poll);

        //draw chart
        this.drawPreviewChart();
    },

    /**
     * Draw the preview chart
     */
    drawPreviewChart: function()
    {
        var self = this;

        self.global.drawChartView.drawToDOM({
            target: self.chartElemSelector,
            fromPreview: $(".chart-preview-area")
        }, true);
    }
});