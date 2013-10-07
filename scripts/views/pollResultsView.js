var PollResultsView = Backbone.View.extend({
    el: ".poll-results-graph",

    initialize: function()
    {
        _.bindAll(this, 'render');

        this.standAlone = false;

        var self = this;

        Backbone.on('call-pollResultsView', function(){
            // console.log('Results call');
            self.render();
        });

        this.on('rendered', function(){
            self.$el.parents(".container").css('width', '100% !important');
        });

        // this.render();
        this.global.resultsModel.bind('change', _.bind(this.render, this));
    },

    render: function()
    {
        // console.log('r');
        var template =  $( (this.chartType === 'bar') ? "#poll-results-graph-template-bar" : "#poll-results-graph-template-gauge").html();
        $(this.el).html( _.template( template )(this.global.resultsModel.toJSON()) );

        // $(this.el).parents(".hero-unit").fadeIn();

        this.trigger('rendered', this);

        return this;
    },

    processPoll: function(pollSettings, pollGeneratedData)
    {
        var self = this
          , formID = pollSettings.form_id
          , settings = JSON.parse( pollSettings.options )
          , poll = {
                pollData:  pollGeneratedData,
                opt_title: 0,
                opt_value: 1,
                total_results: 0,
                data: []
            }
          , poll_answers_parts = poll.pollData.results.value;

        _.each(poll_answers_parts, function(value, key){
            poll.data.push([key, value]);
            //get total results
            poll.total_results += parseInt(value);
        });

        // console.log(poll.data);
        var pollID = "chartContainer-" + formID
          , gWidth = $(self.el).parents('.hero-unit').width()
          , gHeight = (window.innerHeight - $(".navbar").height() - parseInt($('body').css('margin-top')))
          , legends = this.global.resultsModel.get('legends')
          , pollElem = $('<div />', {id: pollID}).css({
               width: ( settings.type === "gauge" ) ? 700 : 1024,
               height: 600,
               margin: "0 auto"
          });

        //put title
        $("#upper-chart-title", this.$el).html(poll.pollData.results.name);

        //remove any unused markers if any before execute the rest
        self.global.chartOptionsView.handle_Bars_Markers_total(settings.bars.length, function(){

            var chartPoll = self.global.chartOptionsModel.get('poll')
            //console.log("new chart", chartPoll);

            //modify chart options, markers and scale visibility
            chartPoll.type = settings.type;
            chartPoll.common.marker.visible = Boolean(settings.common.marker);
            chartPoll.common.scale.label.visible = Boolean(settings.common.scale);

            //modify poll bars
            _.each(chartPoll.bars, function(value, key){

                //modify color ad bgcolor, get it from the settings
                chartPoll.bars[key].color = settings.bars[key].color;
                chartPoll.bars[key].backgroundColor = settings.bars[key].bgcolor;

                //get the percent value of the poll and modify poll bar value
                var percent = Math.round((parseInt(poll.data[key][poll.opt_value])/parseInt(poll.total_results))*100);
                chartPoll.bars[key].value = percent;

                //modify offset
                chartPoll.bars[key].offset = chartPoll.bars[key].offset + (key*10);

                //add title to legend
                legends[key] = {};
                legends[key].name = String(poll.data[key][poll.opt_title]);
                legends[key].value = percent;
                legends[key].hits = poll.data[key][poll.opt_value];
                legends[key].color = chartPoll.bars[key].color;

            });

            //save to chartoption model
            self.global.chartOptionsModel.set('poll', chartPoll);

            //draw the graph when successfully rendered template
            self.on('rendered', function(){
                self.global.drawChartView.drawToDOM({
                    target: $("#"+pollID),
                    pollTitle: poll.pollData.results.name
                });
            });
                
            //update result model
            self.global.resultsModel.set({
                legends: legends,
                chartPollElement: $(pollElem).prop('outerHTML')
            });
        });
    }
});