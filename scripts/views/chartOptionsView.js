var ChartOptionsView = Backbone.View.extend({
    el: ".poll-chart-options",
    events: {
        "click #updatePreview": 'updatePreviewWindow',
        'click #gaugePreview': 'changeChartType',
        'click #linearPreview': 'changeChartType',
        'change #pollMarker': 'updatePreviewWindow',
        'change #pollScale': 'updatePreviewWindow',
    },

    initialize: function()
    {
        _.bindAll(this, 'render');
        this.template = _.template( $("#poll-chart-options-template").html() );

        var self = this;

        this.storageKeyname = "jotpoll_config";

        //save options default - to be access later
        this.global.chartOptionsModel.savePollData_Defaults();

        Backbone.on('call-chartOptionsView', function(){
            console.log('chartOptionsView call');
            self.buildOptionsTemplateData(function(){
                self.updateChartType().redraw();
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
        var poll = this.global.chartOptionsModel.defaults.poll
          , element = this.global.chartOptionsModel.defaults.element

        //read poll options from config
        var pollOptions = this.getPollOptionsFromStorage()
          , rawData = null;

        if ( pollOptions !== false )
        {
            rawData = JSON.parse( RawDeflate.inflate( B64.decode( pollOptions ) ) );
            poll = rawData.poll;
            element.common = rawData.common;
        }

        this.global.chartOptionsModel.set({
            poll: poll,
            element: element
        });

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

    redraw: function()
    {
        this.render();
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

        this.savePollOptionsToStorage();
    },

    /**
     * Depends how many is our poll count, remove some unused bars and markers or show them
     */
    handle_Bars_Markers_Tabs: function()
    {
        //get the default data of chart options
        var poll = this.global.chartOptionsModel.getPollData_Defaults()
          , total_poll_to_draw = this.global.pollDataModel.get('total_polls')
          , final_bars = []
          , final_markers = [];

        console.log("Defaults poll", poll);

        //merge the user options to default
        var current_poll = this.global.chartOptionsModel.get('poll');
        for( var x = 0; x < current_poll.bars.length; x++ )
        {
            poll.bars[x] = current_poll.bars[x];
            poll.markers[x] = current_poll.markers[x];
        }

        //cut
        for( var i = 0; i < poll.bars.length; i++ ) 
        {
            //push bars and markers to finale array
            final_bars.push(poll.bars[i]);
            final_markers.push(poll.markers[i]);

            //if reach maximum, break
            if ( (i + 1) == total_poll_to_draw )
            {
                break;
            }
        }

        //assign the new data to poll model
        poll.bars = final_bars;
        poll.markers = final_markers;
        this.global.chartOptionsModel.set('poll', poll);

        //modify the tabs, to only show specific tabs, depends on how many polls we have
        this.handleBarTabs();
    },

    /**
     * Responsible on showing and hiding of tabs
     */
    handleBarTabs: function()
    {
        var tabs = $(".tab-content-options ul.nav-tabs", this.$el)
          , li = tabs.children();

        //get total polls from questions
        var total_polls = this.global.pollDataModel.get('total_polls');

        li.each(function(index){
            //hide anything greater than the polls, otherwise show it
            if (index >= total_polls) {
                $(this).hide();
            } else {
                $(this).show();
            }
        });

        //update the preview chart and tabs
        this.redraw();
    },

    /**
     * Return poll options from storage otherwise boolean false
     */
    getPollOptionsFromStorage: function()
    {
        if ( !$.jStorage.storageAvailable() ) {
            return false;
        }
        
        return $.jStorage.get(this.storageKeyname, false);
    },

    /**
     * Save poll options to storage if available
     */
    savePollOptionsToStorage: function()
    {
        if ( !$.jStorage.storageAvailable() ) {
            return;
        }

        var poll = this.global.chartOptionsModel.get('poll')
          , element = this.global.chartOptionsModel.get('element');

        var o = {
            poll: poll,
            common: element.common
        };

        var data = B64.encode( RawDeflate.deflate(JSON.stringify(o)) )
          , daySeconds = 85400 , dayMonth = 30, dayYear = 365;

        $.jStorage.set(this.storageKeyname, data, {TTL: (daySeconds * dayMonth)}); // expires in 1 month or so
    },

    /**
     * Change what poll chart to use
     * - selected from user 
     */
    changeChartType: function(e)
    {
        var poll = this.global.chartOptionsModel.get('poll')
          , targetContainer = $(e.target).parents('.common-settings');

        poll.type = $("input[type=radio]", targetContainer).val();
        this.global.chartOptionsModel.set('poll', poll);

        //update chart when user pick what chart to use
        this.updateChartType().redraw();
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