var PollResultsView = Backbone.View.extend({
    el: ".poll-results-graph",

    initialize: function()
    {
        _.bindAll(this, 'render');

        this.standAlone = false;

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
        this.formID = responseData.form;
        this.questionIndex = responseData.question;

        //set now the options of the chart poll
        this.global.chartOptionsModel.set('poll', responseData.chart.poll);

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

        var chartPoll = this.global.chartOptionsModel.get('poll');

        var pollID = "chartContainer-" + self.formID
          , gWidth = $(self.el).parents('.hero-unit').width()
          , gHeight = (window.innerHeight - $(".navbar").height() - parseInt($('body').css('margin-top')))
          , legends = this.global.resultsModel.get('legends')
          , pollElem = $('<div />', {id: pollID}).css({
               width: ( chartPoll.type === "gauge" ) ? 700 : 1024,
               height: 600,
               margin: "0 auto"
          });

        //modify chart options and value
        $.each(chartPoll.bars, function(index, value){

            //get the percent value of the poll and modify poll bar value
            var percent = Math.round((parseInt(poll.data[index][poll.opt_value])/parseInt(poll.total_results))*100);
            chartPoll.bars[index].value = percent;

            chartPoll.bars[index].offset = chartPoll.bars[index].offset + (index*10);

            //add title to legend
            legends[index] = {};
            legends[index].name = String(poll.data[index][poll.opt_title]);
            legends[index].value = percent;
            legends[index].hits = poll.data[index][poll.opt_value];
            legends[index].color = chartPoll.bars[index].color;

        });

        //save to chartoption model
        this.global.chartOptionsModel.set('poll', chartPoll);

        //draw the graph when successfully rendered template
        this.on('rendered', function(){
            this.global.drawChartView.drawToDOM({
                target: $("#"+pollID),
                pollTitle: poll.pollData.results[self.formID][self.questionIndex].name
            });
        });
            
        //update result model
        this.global.resultsModel.set({
            legends: legends,
            chartPollElement: $(pollElem).prop('outerHTML')
        });
    }
});