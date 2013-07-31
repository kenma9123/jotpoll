$(window).load(function(){

    if (
        JF && typeof JF === 'object' &&
        Backbone && typeof Backbone === 'object'
    )
    {
        // Extend Backbone with events so we can use custom events
        _.extend(Backbone, Backbone.Events);

        var poll = {};
        Backbone.View.prototype.global = poll;
        Backbone.Model.prototype.global = poll;
        Backbone.Router.prototype.global = poll;

        poll.pollDataModel = new PollDataModel();
        poll.resultsModel = new PollResultsModel();
        poll.resultsView = new PollResultsView();
        poll.navigatorModel = new PollNavigatorModel();
        poll.navigatorView = new PollNavigatorView();
        poll.generateView = new GenerateCodeView();
        poll.drawChartView = new DrawChartView();
        poll.chartOptionsModel = new ChartOptionsModel();
        poll.chartOptionsView = new ChartOptionsView();
        poll.previewChartView = new PreviewChartView();
        poll.router = new PollRouter();

        window.base = $('base').attr('href').split(location.origin)[1];
        Backbone.history.start({pushState: true, root: base});
        // Backbone.history.start();
    }
    else
    {
        console.error("Required Libraries: Backbone OR JotForm API were missing in action");
    }
});