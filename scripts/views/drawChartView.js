var DrawChartView = Backbone.View.extend({

    initialize:function()
    {
        var self = this;

        self.customOffsetLinear = [];

        Backbone.on('call-drawChart', function(){
            // console.log('drawchart call');
        });
    },

    handleParentContainers: function(drawData, cb)
    {
        if ( !drawData.fromPreview )
        {    
            $(drawData.target).parents('.hero-unit').css('visibility','visible').hide().fadeIn('fast', cb);
        }
        else
        {
            if (cb) cb();
        }
    },

    drawToDOM: function( drawData, isPreview )
    {
        var self = this
          , chartPoll = this.global.chartOptionsModel.get('poll');

        self.isPreview = (isPreview) ? true : false;

        // console.log( chartPoll );
        if ( drawData.fromPreview )
        {
            $(drawData.fromPreview).remove();
            $("<div />").addClass("chart-preview-area").appendTo(".chart-preview");
        }

        //draw poll title
        var polltitle = ( drawData.pollTitle ) ? {
                            text: drawData.pollTitle,
                            position: 'bottom-center',
                            font: {
                                size: 20
                            }
                        } : {};

        var chartCommonOptions = {
            margin: ( !drawData.fromPreview ) ? { top: 25, bottom: 25 } : {},
            scale: chartPoll.common.scale,
            rangeContainer: chartPoll.rangeContainer,
            commonRangeBarSettings: chartPoll.commonRangeBarSettings,
            // subtitle: {// text: 'subtitle'},
            title: polltitle,
            markers: chartPoll.markers,
            rangeBars: chartPoll.bars
        };

        // console.log("final", chartCommonOptions);

        self.handleParentContainers(drawData, function(){

            //before drawing choose what type
            if ( chartPoll.type === 'gauge' )
            {
                self.setupGaugeChart(function(){
                    //get newly update chart
                    var c = self.global.chartOptionsModel.get('poll');
                    $(drawData.target).dxCircularGauge({
                        preset: "preset3",
                        spindle: {visible: false},
                        margin: ( !drawData.fromPreview ) ? { top: 25, bottom: 25 } : {},
                        scale: c.common.scale,
                        rangeContainer: c.rangeContainer,
                        commonRangeBarSettings: c.commonRangeBarSettings,
                        // subtitle: {// text: 'subtitle'},
                        title: polltitle,
                        markers: c.markers,
                        rangeBars: c.bars
                    });
                });
            }
            else if ( chartPoll.type === 'linear' )
            {
                self.setupLinearChart(function(){
                    //get newly update chart
                    var c = self.global.chartOptionsModel.get('poll');
                    $(drawData.target).dxLinearGauge({
                        margin: ( !drawData.fromPreview ) ? { top: 25, bottom: 25 } : {},
                        scale: c.common.scale,
                        commonRangeBarSettings: c.commonRangeBarSettings,
                        // subtitle: {// text: 'subtitle'},
                        title: polltitle,
                        markers: c.markers,
                        rangeBars: c.bars,
                        rangeContainer: ( c.common.scale.label.visible === true ) ? {
                            backgroundColor: "none",
                            ranges: [
                                {
                                    startValue: 0,
                                    endValue: 15,
                                    color: "#E19094"
                                },
                                {
                                    startValue: 15,
                                    endValue: 60,
                                    color: "#FCBB69"
                                },
                                {
                                    startValue: 60,
                                    endValue: 100,
                                    color: "#A6C567"
                                }
                            ]
                        } : {backgroundColor: "none"}
                    });
                });
            }
        });
    },

    /**
     * setup the poll chart Data
     */
    setupGaugeChart: function(cb)
    {
        //variables
        var self = this
          , poll = this.global.chartOptionsModel.get('poll')
          , tempMarkers = [];

        $.each(poll.bars, function(index, value){
            //if markers is visible, removed text indent
            if ( poll.common.marker.visible === true )
            {
                poll.bars[index].text.indent = 0;

                //build marker arrays, from poll data
                var markerObject = {
                    value: poll.bars[index].value,
                    offset: poll.bars[index].offset,
                    color: poll.bars[index].color,
                    length: 30,
                    type: 'textCloud',
                    text: {
                        font: {
                            size: 12
                        },
                        customizeText: function(){
                            var text = parseInt(this.valueText) + "%";
                            if ( self.isPreview ) {
                                text += "<br/>" + self.global.chartOptionsModel.defaults.bar_names[index]
                            }
                            return text;
                        }
                    }
                };

                tempMarkers.push(markerObject);
            }
        });

        //set markers
        poll.markers = tempMarkers;

        //update poll
        this.global.chartOptionsModel.set('poll', poll);
        // console.log('final', this.global.chartOptionsModel.get('poll'));

        if (cb) cb();
    },

    /**
     * setup the linear chart Data
     */
    setupLinearChart: function(cb)
    {
        //variables
        var poll = this.global.chartOptionsModel.get('poll')
          , tempMarkers = []
          , self = this;

        $.each(poll.bars, function(index, value){

            //removed text indent
            poll.bars[index].text.indent = 0;

            // if ( typeof this.isCustomOffset === "undefined" )
            // {
            //     poll.bars[index].offset = poll.bars[index].offset + 20;
            //     self.customOffsetLinear.push(index);
            // }

            //build marker arrays, from poll data
            var markerObject = {
                value: poll.bars[index].value,
                offset: poll.bars[index].offset,
                color: poll.bars[index].color,
                type: 'textCloud',
                horizontalOrientation: 'right',
                verticalOrientation: 'top',
                text:
                {
                    font: { size: 12 },
                    customizeText: function(){
                        return parseInt(this.valueText) + "%";
                    }
                }
            };

            tempMarkers.push(markerObject);
        });

        //set markers
        poll.markers = tempMarkers;

        //update poll
        this.global.chartOptionsModel.set('poll', poll);
        // console.log('final', this.global.chartOptionsModel.get('poll'));

        if (cb) cb();
    }
});