var ChartOptionsView = Backbone.View.extend({
    el: ".poll-chart-options",
    events: {
        "click #updatePreview": 'updatePreviewWindow',
        'click #gaugePreview': 'changeChartType',
        'click #linearPreview': 'changeChartType',
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
                self.updateChartType().render();
            });
        });

        this.on('rendered', function(){

            // Tooltips
            $("[data-toggle=tooltip]").tooltip("show");

            // Switch
            $("[data-toggle='switch']").wrap('<div class="switch" />').parent().bootstrapSwitch();

            //tabs
            var gaugeTabs = $("#gaugeChart");
            $(".nav-tabs a:first", gaugeTabs).tab('show');
            $(".tab-content", gaugeTabs).show();

            //minicolors
            $('input.bar-input').minicolors({
                theme: 'flatUI'
            });

            //radio buttons
            $('[data-toggle="radio"]').each(function () {
                var $radio = $(this);
                $radio.radio();
            });

            //update preview window on start up
            this.updatePreviewWindow();
        });
    },

    /**
     * Build Options template data and display it
     */
    buildOptionsTemplateData: function(cb)
    {
        // var poll = this.global.chartOptionsModel.get('poll')
        //   , element = this.global.chartOptionsModel.get('element')
        //   , wholeGaugeTabContent = "";

        // //attach to the common elements if its ON or OFF
        // $.each(element.common, function(index,value){
        //     switch(index)
        //     {
        //         case 'scale':
        //             element.common[index].checked = (poll.common[index].label.visible === true) ? 'checked="checked"' : '';
        //             element.common[index].invisible = (poll.type === 'linear') ? true : false;
        //         break;
        //         default:
        //             element.common[index].checked = (poll.common[index].visible === true) ? 'checked="checked"' : '';
        //             element.common[index].invisible = (poll.type === 'gauge') ? true : false;
        //         break;
        //     }
        // });
        
        var poll = this.global.chartOptionsModel.get('poll');
        poll.type = "linear";
        this.global.chartOptionsModel.set('poll', poll);

        //put data to another template that will build the bar TABS
        // var gaugeTabContent = $("#poll-chart-options-gaugeTab-template").html();
        // $.each(poll.bars, function(index,value){
        //     var jsonData = {
        //         barIndex: index + 1,
        //         colorElement: element.bars.color,
        //         bgcolorElement: element.bars.backgroundColor,
        //         barColor: poll.bars[index].color,
        //         barBgColor: poll.bars[index].backgroundColor
        //     };

        //     wholeGaugeTabContent += _.template( gaugeTabContent )( jsonData );
        // });
        
        // //update poll tab content
        // this.global.chartOptionsModel.set('barTabsContent', wholeGaugeTabContent);

        //update common content
        // this.global.chartOptionsModel.set('element', element);
        
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

        var poll = this.global.chartOptionsModel.get('poll')
          , element = this.global.chartOptionsModel.get('element');

        //get data from the tabs
        $.each(poll.bars, function(index,value){

            //select the element
            var i = index + 1
              , colorValue = self.elem(element.bars.color + i).val()
              , bgcolorValue = self.elem(element.bars.backgroundColor + i).val();

            //update variable poll
            poll.bars[index].color = colorValue;
            poll.bars[index].backgroundColor = bgcolorValue;
        });

        //get value for common settings
        $.each(element.common, function(index,value){

            var valBool = self.elem(value.id).is(":checked");

            switch(index)
            {
                case 'marker':
                case 'needle':
                case 'spindle':
                    poll.common[index].visible = valBool;
                break;
                case 'scale':
                    poll.common[index].label.visible = valBool;
                break;
            }
        });

        //update chart model
        this.global.chartOptionsModel.set('poll', poll);

        //draw chart
        this.global.previewChartView.drawPreviewChart();
    },

    /**
     * Change what poll chart to use
     * - selected from user 
     */
    changeChartType: function(e)
    {
        var poll = this.global.chartOptionsModel.get('poll');

        poll.type = $("input[type=radio]", e.target).val();
        this.global.chartOptionsModel.set('poll', poll);

        //update chart when user pick what chart to use
        this.updateChartType().render();
    },

    /**
     * Update model chart
     */
    updateChartType: function()
    {
        var poll = this.global.chartOptionsModel.get('poll')
          , elements = this.global.chartOptionsModel.get('element')
          , self = this;

        //set what type of chart was used
        _.each(elements.chart, function(value, key){

            //reset everthing
            elements.chart[key].checked = false;

            if ( key === poll.type ) {
                elements.chart[key].checked = true;
            }
        });

        //attach to the common elements if its ON or OFF
        $.each(elements.common, function(index,value){
            switch(index)
            {
                case 'scale':
                    elements.common[index].checked = poll.common[index].label.visible;
                break;
                default:
                    elements.common[index].checked = poll.common[index].visible;
                    elements.common[index].invisible = (poll.type === 'linear') ? true : false;
                break;
            }
        });

        this.global.chartOptionsModel.set({
            poll: poll,
            element: elements
        });

        return this;
    }
});