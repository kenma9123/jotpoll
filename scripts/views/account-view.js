var AccountView = Backbone.View.extend({

    initialize: function()
    {
        var self = this;

        //console.log("init");
        this._acc_storage = '_jotPoll_userData';

        Backbone.on('call-accountView', function(){
            console.log("Account View call");
            self.handleJFUser();
        });
    },

    removeJFUserData: function(next)
    {
        JF.logout();
        $.jStorage.deleteKey(this._acc_storage);
        if (next) next();
    },

    checkJFUserData: function(next)
    {
        var self = this;
        var data = $.jStorage.get(self._acc_storage);
        if (next) next.call(self, data);
    },

    handleUserFromBackground: function(user)
    {
        //console.log("logging user from background");
        this.handleAccount(JSON.parse(user), function(response){
            //console.log("Successfully logged in from background", response);
        });
    },

    handleAccount: function(user, next)
    {
        var self = this;

        $.ajax({
            url: 'server.php',
            method: 'POST',
            data: {
                action: 'handleAccount',
                username: user.username,
                email: user.email,
                key: JF.getAPIKey()
            },
            success: function(dataR)
            {
                console.log(dataR);
                //set data to model - to be accessed later
                self.setAccountObject($.extend({}, user, dataR.user_data));

                if (next) next(dataR);
            },
            error: function(error)
            {
                console.error(error);
                throw new Error("Something went wrong handling account");
            }
        });
    },

    handleJFUser: function(next)
    {
        var self = this;
        //get user information from JotForm
        JF.getUser(function(user){

            //delete some unecessary data
            delete user['senderEmails'];

            //check if active 
            if ( String(user.status).toLowerCase() === 'active' )
            {
                //send to server
                self.handleAccount(user, function(response){
                    console.log("Created", response);
                    if (next) next(response);
                });
            } else {
                throw new Error("User is not ACTIVE anymore");
            }
        }, function(e){
            throw "Something went wrong when fetching User data with message:" + e;
        });
    },

    setAccountObject: function(object)
    {
        //apply storage data and expire in 1 day
        $.jStorage.set(this._acc_storage, JSON.stringify(object), {TTL: (86400 * 1000)});

        this.global.accountModel.set('user_data', object);

        console.log("User data", this.global.accountModel.get('user_data'));
    }
});