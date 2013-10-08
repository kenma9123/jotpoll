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

        jotpoll.router = new PollRouter();

        window.base = $('base').attr('href').split(location.origin)[1];
        Backbone.history.start({pushState: true, root: base});
    }
    else
    {
        console.error("Required Libraries: Backbone.js OR JotForm API were missing in action");
    }
});