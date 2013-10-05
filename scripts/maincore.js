$(window).load(function(){

    if (
        JF && typeof JF === 'object' &&
        Backbone && typeof Backbone === 'object'
    )
    {
        // Extend Backbone with events so we can use custom events
        _.extend(Backbone, Backbone.Events);

        var jotpoll = {};
        Backbone.View.prototype.global = jotpoll;
        Backbone.Model.prototype.global = jotpoll;
        Backbone.Router.prototype.global = jotpoll;

        jotpoll.accountModel = new AccountModel();
        jotpoll.accountView = new AccountView();
        jotpoll.pollDataModel = new PollDataModel();
        jotpoll.resultsModel = new PollResultsModel();
        jotpoll.resultsView = new PollResultsView();
        jotpoll.navigatorModel = new PollNavigatorModel();
        jotpoll.navigatorView = new PollNavigatorView();
        jotpoll.generateView = new GenerateCodeView();
        jotpoll.drawChartView = new DrawChartView();
        jotpoll.chartOptionsModel = new ChartOptionsModel();
        jotpoll.chartOptionsView = new ChartOptionsView();
        jotpoll.previewChartView = new PreviewChartView();
        jotpoll.router = new PollRouter();

        window.base = $('base').attr('href').split(location.origin)[1];
        Backbone.history.start({pushState: true, root: base});
    }
    else
    {
        console.error("Required Libraries: Backbone.js OR JotForm API were missing in action");
    }
});