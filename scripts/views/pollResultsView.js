var PollResultsView = Backbone.View.extend({
    el: ".poll-results-graph",

    initialize: function()
    {
        _.bindAll(this, 'render');

        this.standAlone = false;

        this.chartType = 'gauge';

        var self = this;

        Backbone.on('call-pollResultsView', function(){
            console.log('Results call');
            self.render();
        });

        // this.render();
        this.global.resultsModel.bind('change', _.bind(this.render, this));
    },

    render: function()
    {
        console.log('r');
        var template =  $( (this.chartType === 'bar') ? "#poll-results-graph-template-bar" : "#poll-results-graph-template-gauge").html();
        $(this.el).html( _.template( template )(this.global.resultsModel.toJSON()) );

        // $(this.el).parents(".hero-unit").fadeIn();
        

        this.trigger('rendered', this);

        return this;
    },

    processPoll: function(responseData)
    {
        var r = responseData;

        this.formID = r.form;
        this.questionIndex = r.question;

        //set now the options of the chart gauge
        this.global.chartOptionsModel.set('gauge', r.chart.gauge);

        //get form submission from the form ID
        this.global.resultsModel.getFormSubmissions(this.formID);
    },

    displayPollResults: function()
    {
        var self = this;

        var poll = {
            pollData:  this.global.pollDataModel.get('_pollData'),
            opt_title: 0,
            opt_value: 1,
            total_results: 0,
            data: []
        };

        var pollParts = poll.pollData.results[this.formID][ this.questionIndex ].value;
        $.each(pollParts, function(index, value){
            poll.data.push([index,value]);
            //get total results
            poll.total_results += parseInt(value);
        });

        console.log(poll.data);

        if ( this.chartType === 'gauge' )
        {
            var gaugeID = "chartContainer-" + self.formID
              , gWidth = $(self.el).parents('.hero-unit').width()
              , gHeight = (window.innerHeight - $(".navbar").height() - parseInt($('body').css('margin-top')))
              , gauge = this.global.chartOptionsModel.get('gauge')
              , legends = this.global.resultsModel.get('legends')
              , gaugeElem = $('<div />', {id: gaugeID}).css({
                   width: 700,
                   height: 600,
                   margin: "0 auto"
              });

            //modify chart options and value
            $.each(gauge.bars, function(index, value){

                //get the percent value of the poll and modify gauge bar value
                var percent = Math.round((parseInt(poll.data[index][poll.opt_value])/parseInt(poll.total_results))*100);
                gauge.bars[index].value = percent;

                //add title to legend
                legends[index] = {};
                legends[index].name = String(poll.data[index][poll.opt_title]);
                legends[index].value = percent;
                legends[index].color = gauge.bars[index].color;

            });

            //save to chartoption model
            this.global.chartOptionsModel.set('gauge', gauge);

            //and again get it
            var gauge = this.global.chartOptionsModel.get('gauge');

            //draw the graph when successfully rendered template
            this.on('rendered', function(){
                this.global.drawChartView.setupGaugeChart(function(){
                    $(self.chartElemSelector).remove();
                    $("<div />").addClass("chart-preview-area").appendTo(".chart-preview");
                    $("#"+gaugeID).parents('.hero-unit').css('visibility','visible').hide().fadeIn('fast', function(){
                        $("#"+gaugeID).dxCircularGauge({
                            preset: "preset3",
                            margin: { top: 25,bottom: 25 },
                            scale: gauge.common.scale,
                            spindle: gauge.common.spindle,
                            rangeContainer: { backgroundColor: "none" },
                            commonRangeBarSettings: gauge.commonRangeBarSettings,
                            subtitle: {
                                // text: 'subtitle'
                            },
                            title: {
                                text: poll.pollData.results[self.formID][self.questionIndex].name,
                                position: 'bottom-center',
                                font: {
                                    size: 20
                                }
                            },
                            needles: gauge.needles,
                            markers: gauge.markers,
                            rangeBars: gauge.bars
                        });
                    });
                });
            });
                
            //update result model
            this.global.resultsModel.set({
                chartGaugeElement: $(gaugeElem).prop('outerHTML')
            });
        }
    },

    get_random_color: function() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.round(Math.random() * 15)];
        }
        return color;
    },

    animatePollResult: function()
    {
        var self = this;
        var e =  $( ( self.navigatorView && self.navigatorView._elems.pollResults ) || ".poll_results_graph");
        console.log(e);
        e.fadeIn(function(){
            $('.bars-graph').each(function(){
                var percentage = $(this).text();
                $(this).css({
                    width: percentage,
                    'background': self.get_random_color()
                });
            });
        });
    }
});