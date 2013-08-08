// We have to extend bacbone to catch each and every URL change
// Because currently we can only catch {trigger: true} URLs
Backbone.History.prototype.navigate = _.wrap(Backbone.History.prototype.navigate, function(){
    // Get arguments as an array
    var args = _.toArray(arguments);
    // firs argument is the original function
    var original = args.shift();
    // Set the before event
    Backbone.history.trigger('before:url-change');
    // Call original function
    var res = original.apply(this, args);
    // After event
    Backbone.history.trigger('url-changed');
    // Return original result
    return res;
});

/**
 * Handles the pushState URL routing of the application
 * @type {Backbone.Router}
 */
var PollRouter = Backbone.Router.extend({
    /**
     * Constructor
     */
    initialize: function(options)
    {
        var self = this;

        // Track URL changes to fix opera bug
        Backbone.history.bind('url-changed', function(){
            // Damn stupid OPERA bug
            // http://my.opera.com/community/forums/topic.dml?id=1185462
            $('base').attr('href', $('base').attr('href'));
        });
    },

    /**
     * List of routes
     * @type {Object}
     */
    routes:
    {
        "" : "home",
        "result/*encodedData": "showPollResultsData"
    },

    //handle what type is being taken
    //such as generator[when generating form data",
    //viewer[when viewing poll results directly], normal[the normal use]
    currentType: "",

    /**
     * Initialize JotForm API,
     * @param cb - callback function if successfully initialized jotform
     * @param prompt - whether to prompt login or not
     * @param apiKey - if prompt this will be ignore ( only initialize when viewing results data )
     */
    initJF: function(cb, prompt, apiKey)
    {
        var self = this;

        //init JF
        JF.init({
            enableCookieAuth : true,
            appName: "Poll Results",
            accesType: "full" //default "readOnly" or "full"
        });

        if ( !prompt )
        {
            if (!apiKey) console.error('Api key needed');
            //"1c4efba0d67e0e77aee4dee551b4259f"
            // JF.initialize( {apiKey: "76d37e1b759fcbe67063a39166747301"} );
            JF.initialize({apiKey: apiKey});
            if(cb) cb.apply(self);
        }
        else
        {
            console.log('key', JF.getAPIKey());
            // JF.initialize( {apiKey: "1c4efba0d67e0e77aee4dee551b4259f"} );/
            // if(cb) cb.apply(self);
            if ( !JF.getAPIKey() )
            {
                var a = JF.login(
                    function success(){
                        console.log('success');
                    if(cb) cb.apply(self);
                }, function error(e){
                        console.log(e);
                        $(".alert").show().alert();
                    // if(cb) cb.apply(self);
                });
            }
            else
            {
                if(cb) cb.apply(self);
            }
        }
    },

    require: function(req)
    {
        if ( req.length > 0 )
        {
            for ( x in req )
            {
                // console.log('call-' + req[x]);
                Backbone.trigger('call-' + req[x]);
            }
        }
    },

    home: function()
    {
    	console.log('home');
        this.initJF(function(){
            this.showContainers();
            //require some data
            this.require([
                'pollDataModel', 'chartPreview', 'chartOptionsView', 
                'pollNavigatorView','pollNavigatorModel', 'generateView', 
            ]);
        },true);
    },

    showContainers: function()
    {
        $(".hero-unit").fadeIn();
    },

    showPollResultsData: function(encodedData)
    {
        // var arr = {
        //     form:32011394412946,
        //     question:5,
        //     apiKey: "1c4efba0d67e0e77aee4dee551b4259f", 
        // };
        // console.log( _(arr).toJSON() );

        var parsed = JSON.parse( RawDeflate.inflate(B64.decode(encodedData)) );
        console.log(parsed);

        this.initJF(function(){
            //require some data
            this.require([
                'pollDataModel','chartOptionsView', 'drawChart',
                'pollResultsView','pollResultsModel'
            ]);
            
            this.global.resultsView.processPoll(parsed);
        }, false, parsed.apiKey);
    }
});