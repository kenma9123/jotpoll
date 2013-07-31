/**
 * JotForm.js 0.1.0
 *
 *  (c) 2013 JotForm Easiest Form Builder
 *
 * JotForm.js may be freely distributed under the MIT license.
 * For all details and documentation:
 * http://api.jotform.com
 */

/*
 * INITIAL SETUP
 * =============
 *
 * Include JotForm.js script to your page
 * 
 * __<script src="http://js.jotform.com/JotForm.js"></script>__
 *   
 * Initialize SDK    
 *
 *      JF.initialize({ apiKey: YOUR_API_KEY })
 *
 * In case of you are using SDK in a 3rd pary app
 *
 *      JF.initialize({ appName: YOUR_APP_NAME })
 * 
 */

/*global _readCookie, _createCookie, root, _getWindowDimensions, removeElement, _createCORSRequest, console*/
var JF = (function(base) {
    var _apiKey = _readCookie("jf_auth"),
        _appName,
        _baseURL = 'http://www.jotform.com',
        _requestURL = 'http://api.jotform.com',
        _loginWindowURL = _baseURL + '/api/oauth.php',
        _accessType = 'readOnly',
        root = {};

    /**
     * SDK can be initialized with apiKey and appName parameters
     */
    root.initialize = function(options) {

        if (options === undefined) {
            return;
        }

        /*
         * API requests URL
         * 
         *     default: http://api.jotform.com
         */
        if (options.apiURL === 'string') {
            _requestURL = options.requestURL;
        }

        /*
         * initialize SDK with API Key
         * 
         *     default: undefined
         *
         * Note that you can't call any method without a valid API Key
         */
        if (typeof options.apiKey === 'string') {
            _apiKey = options.apiKey;
            //keep API key as cookie for later use
            _createCookie("jf_auth", _apiKey);
        }

        /**
         * application name for 3rd party applications
         */
        if (typeof options.appName === 'string') {
            _appName = options.appName;
        }

        /*
         *  application access type parameter shuld be given on initialize
         *  if not given defult is readOnly
         */
        if ( options.accessType === 'readOnly' ||  options.accessType === 'full' ) {
            _accessType = options.accessType;
        } 
    };

    /*
     * returns _apiKey
     * 
     * returns null if user is not logged in
     */
    root.getAPIKey = function() {
        return _apiKey;
    };

    /**
     * open http://www.jotform.com/api/oauth.php iframe if __apiKey is undefined
     *
     * 
     * executes "success" callback function after successful login
     *
     * 
     * executes "error" callback function if user does not allow
     * 
     */
    root.login = function(success, error) {
        if (_apiKey !== null) {
            if(success && typeof success === 'function') {
                success();
                return;
            }
        }

        var container = document.body,
            innerWidth = _getWindowDimensions().width,
            dimmer = document.createElement("div"),
            frame = document.createElement('IFRAME'),
            wrapperDiv = document.createElement("div"),
            margin = (innerWidth - 450) / 2,
            closeButton = document.createElement("a"),
            ref = document.location.href;
        dimmer.setAttribute("id", "jotform_oauth_frame_mask");
        dimmer.style.position = "fixed";
        dimmer.style.width = "100%";
        dimmer.style.height = "100%";
        dimmer.style.top = "0";
        dimmer.style.left = "0";
        dimmer.style.zIndex = "9999";
        dimmer.style.background = "rgba(0,0,0,0.7)";
        wrapperDiv.setAttribute("id", "jotform_oauth_frame_wrapper");
        wrapperDiv.style.zIndex = 9999;
        wrapperDiv.style.marginLeft = margin + "px";
        wrapperDiv.style.width = "450px";
        closeButton.style.display = "block";
        closeButton.style.left = "200px";
        closeButton.innerText = "Close X";
        closeButton.style.backgroundColor = "rgba(0,0,0,0.4)";
        closeButton.style.color = "white";
        closeButton.style.fontSize = "14px";
        closeButton.style.padding = "5px 8px";
        closeButton.style.cursor = "pointer";
        closeButton.style.float = "right";

        closeButton.onclick = function() {
            removeElement("jotform_oauth_frame_mask");
        };

        wrapperDiv.appendChild(closeButton);
        if (ref[ref.length - 1] === '#') {
            ref = ref.substr(0, ref.length - 1);
        }

        frame.setAttribute("src", _loginWindowURL + "?ref=" + encodeURIComponent(ref) + "&client_id=" + (_appName !== undefined ? _appName : window.location.host) + "&access_type=" + _accessType);
        frame.setAttribute("id", "jotform_oauth_frame");
        frame.setAttribute("scrolling", "no");

        frame.style.width = 450 + "px";
        frame.style.height = 450 + "px";
        frame.style.backgroundColor = "white";
        frame.style.border = "4px solid #aaa";
        frame.style.borderRadius = "4px";

        wrapperDiv.appendChild(frame);
        dimmer.appendChild(wrapperDiv);

        container.appendChild(dimmer);

        root.successfulLoginCallback = success;
        root.unsuccessfulLoginCallback = error;
    };

    root.logout = function() {
        _eraseCookie("jf_auth");
    }



    /**
     * for all functions successful result will be passed into next (callback) function given as argumen
     */
    /**
     * __GET http://api.jotform.com/user__
     * -----------------------------------
     */
    root.getUser = function(callback, errback) {
        var self = this;
        if (_apiKey === undefined || _apiKey === null) {
            root.login(function() {
                root.getUser(callback, errback);
            });
            return;
        }
        if (this.user && typeof this.user === 'object') {
            callback(this.user);
            return;
        }
        _xdr( _requestURL + "/user?apiKey=" + _apiKey, "get", undefined, function(resp) {
            self.user = resp;
            callback(resp) 
        }, errback);
    };

    /**
     * __GET http://api.jotform.com/usage__
     * ------------------------------------
     */
    root.getUsage = function(callback, errback) {
        var self = this;
        if (_apiKey === undefined || _apiKey === null) {
            root.login(function() {
                root.getUsage(callback, errback);
            });
            return;
        }
        if (this.usage && typeof this.usage === 'object') {
            callback(this.usage);
            return;
        }
        _xdr( _requestURL + "/user/usage?apiKey=" + _apiKey, "get", undefined, function(resp) {
            self.usage = resp;
            callback(resp) 
        }, errback);
    };

    /**
     * __GET http://api.jotform.com/forms__
     * ------------------------------------
     */
    root.getForms = function(callback, errback) {
        var self = this;
        if (_apiKey === undefined || _apiKey === null) {
            root.login(function() {
                root.getForms(callback, errback);
            });
            return;
        }
        if (this.forms && typeof this.forms === 'object') {
            callback(this.forms);
            return;
        }
        _xdr( _requestURL + "/user/forms?apiKey=" + _apiKey, "get", undefined, function(resp) {
            self.forms = resp;
            callback(resp) 
        }, errback);
    };

    /**
     * __GET http://api.jotform.com/subusers__
     * ---------------------------------------
     */
    root.getSubUsers = function(callback, errback) {
        var self = this;
        if (_apiKey === undefined || _apiKey === null) {
            root.login(function() {
                root.getSubUsers(callback, errback);
            });
            return;
        }
        if (this.subusers && typeof this.subusers === 'object') {
            callback(this.subusers);
            return;
        }
        _xdr( _requestURL + "/user/subusers?apiKey=" + _apiKey, "get", undefined, function(resp) {
            self.subusers = resp;
            callback(resp) 
        }, errback);        
    };

    /**
     * __GET http://api.jotform.com/folders__
     * --------------------------------------
     */
    root.getFolders = function(callback, errback) {
        var self = this;
        if (_apiKey === undefined || _apiKey === null) {
            root.login(function() {
                root.getFolders(callback, errback);
            });
            return;
        }
        if (this.folders && typeof this.folders === 'object') {
            next(this.folders);
            return;
        }
        _xdr( _requestURL + "/user/folders?apiKey=" + _apiKey, "get", undefined, function(resp) {
            self.folders = resp;
            callback(resp) 
        }, errback);
    };

    /**
     * __GET http://api.jotform.com/reports__
     * --------------------------------------
     */
    root.getReports = function(callback, errback) {
        var self = this;
        if (_apiKey === undefined || _apiKey === null) {
            root.login(function() {
                root.getReports(callback, errback);
            });
            return;
        }
        if (this.reports && typeof this.reports === 'object') {
            next(this.reports);
            return;
        }
        _xdr( _requestURL + "/user/reports?apiKey=" + _apiKey, "get", undefined, function(resp) {
            self.reports = resp;
            callback(resp) 
        }, errback);        
    };

    /**
     * __GET http://api.jotform.com/settings__
     * ---------------------------------------
     */
    root.getSettings = function(callback, errback) {
        var self = this;
        if (_apiKey === undefined || _apiKey === null) {
            root.login(function() {
                root.getSettings(callback, errback);
            });
            return;
        }
        if (this.settings && typeof this.settings === 'object') {
            callback(this.settings);
            return;
        }
        _xdr( _requestURL + "/user/settings?apiKey=" + _apiKey, "get", undefined, function(resp) {
            self.settings = resp;
            callback(resp) 
        }, errback);          
    };

    /**
     * __GET http://api.jotform.com/forms__
     * ------------------------------------
     */
    root.getHistory = function(callback, errback) {
        var self = this;
        if (_apiKey === undefined || _apiKey === null) {
            root.login(function() {
                root.getHistory(callback, errback);
            });
            return;
        }
        if (this.history && typeof this.history === 'object') {
            callback(this.history);
            return;
        }
        _xdr( _requestURL + "/user/history?apiKey=" + _apiKey, "get", undefined, function(resp) {
            self.history = resp;
            callback(resp) 
        }, errback);         
    };

    /**
     * __GET http://api.jotform.com/form/{formID}__
     * --------------------------------------------
     */
    root.getForm = function(formID, callback, errback) {
        if (_apiKey === undefined || _apiKey === null) {
            root.login(function() {
                root.getForm(formID, callback, errback);
            });
            return;
        }
        if (typeof formID !== 'string') {
            console.error("Form ID should be string");
            return;
        }
        _xdr( _requestURL + "/form/" + formID + "?apiKey=" + _apiKey, "get", undefined, function(resp) {
            callback(resp) 
        }, errback);         
    };

    /**
     * __GET http://api.jotform.com/form/{formID}/questions__
     * ------------------------------------------------------
     */
    root.getFormQuestions = function(formID, callback, errback) {
        if (_apiKey === undefined || _apiKey === null) {
            root.login(function() {
                root.getFormQuestions(formID, callback, errback);
            });
            return;
        }
        if (typeof formID !== 'string') {
            console.error("Form ID should be string");
            return;
        }
        _xdr( _requestURL + "/form/" + formID + "/questions?apiKey=" + _apiKey, "get", undefined, function(resp) {
            callback(resp) 
        }, errback);         
    };

    /**
     * __GET http://api.jotform.com/form/{formID}/question/{questionID}__
     * ----
     */
    root.getFormQuestion = function(formID, questionID, callback, errback) {
        if (_apiKey === undefined || _apiKey === null) {
            root.login(function() {
                root.getFormQuestion(formID, questionID, callback, errback);
            });
            return;
        }
        if (typeof formID !== 'string') {
            console.error("Form ID should be string");
            return;
        }
        if (typeof questionID !== 'string') {
            console.error("Qeustion ID should be string");
            return;
        }
        _xdr( _requestURL + "/form/" + formID + "/question/" + questionID + "?apiKey=" + _apiKey, "get", undefined, function(resp) {
            callback(resp) 
        }, errback);          
    };

    /**
     * __GET http://api.jotform.com/form/{formID}/submissions__
     * ----
     */
    root.getFormSubmissions = function(callback, formID, query) {
        if (_apiKey === undefined || _apiKey === null) {
            root.login(function() {
                root.getFormSubmissions(callback, formID, query);
            });
            return;
        }
        if (typeof formID === "undefined") {
            console.error("You should pass a valid form ID");
            return;
        }        
        var filter, offset, limit, orderby, direction;
        if (query && typeof query === 'object') {
            if (typeof query.filter === 'object' || query.filter) { filter = query.filter || filter; }
            offset = query.offset || offset;
            limit = query.limit || limit;
            orderby = query.orderby || orderby;
            if (query.direction === 'ASC' || query.direction === 'DESC') { direction =  query.direction || direction; }
        }
        var url = _requestURL + "/form/" + formID + "/submissions?apiKey=" + _apiKey + (filter !== undefined ? "&filter=" + JSON.stringify(filter) : "") + 
            (offset !== undefined ? "&offset=" + offset : "") + 
            (limit !== undefined ? "&limit=" + limit : "") + 
            (orderby !== undefined ? "&orderby=" + orderby : "") + 
            (direction !== undefined ? "," + direction : "");
        _xdr( url, "get", undefined, function(resp) {
            callback(resp) 
        }); 
    };

    /**
     * __GET http://api.jotform.com/form/{formID}/files__
     * ----
     */
    root.getFormFiles = function(formID, callback, errback) {
        if (_apiKey === undefined || _apiKey === null) {
            root.login(function() {
                root.getFormFiles(formID, callback);
            });
            return;
        }
        if (typeof formID !== 'string') {
            console.error("Form ID should be string");
            return;
        }
        _xdr( _requestURL + "/form/" + formID + "/files?apiKey=" + _apiKey, "get", undefined, function(resp) {
            callback(resp) 
        }, errback);         
    };

    /**
     * __GET http://api.jotform.com/form/{formID}/webhooks__
     * ----
     */
    root.getFormWebhooks = function(formID, callback, errback) {
        if (_apiKey === undefined || _apiKey === null) {
            root.login(function() {
                root.getFormWebhooks(formID, next);
            });
            return;
        }
        if (typeof formID !== 'string') {
            console.error("Form ID should be string");
            return;
        }
        _xdr( _requestURL + "/form/" + formID + "/webhooks?apiKey=" + _apiKey, "get", undefined, function(resp) {
            callback(resp) 
        }, errback);         
    };

    /**
     * __GET http://api.jotform.com/folder/{submissionID}/__
     * ----
     *
     * requests submissions according to given query
     * successful result will be passed to next function
     *
     * query is an object which may include
     *
     * filter: {"created_at:lt": 2013}  -- default: ""
     * offet: 10 -- default : 0
     * limit: 20 -- default: 100
     * orderby: "updated_at" -- default: ""
     * direction: "ASC" -- default: DESC
     *
     */
    root.getSubmissions = function(callback, query) {
        if (_apiKey === undefined || _apiKey === null) {
            root.login(function() {
                root.getSubmissions(callback, query);
            });
            return;
        }
        var filter, offset, limit, orderby, direction;
        if (query && typeof query === 'object') {
            if (typeof query.filter === 'object' || query.filter) { filter = query.filter || filter; }
            offset = query.offset || offset;
            limit = query.limit || limit;
            orderby = query.orderby || orderby;
            if (query.direction === 'ASC' || query.direction === 'DESC') { direction =  query.direction || direction; }
        }
        var url = _requestURL + "/user/submissions?apiKey=" + _apiKey + (filter !== undefined ? "&filter=" + JSON.stringify(filter) : "") + 
            (offset !== undefined ? "&offset=" + offset : "") + 
            (limit !== undefined ? "&limit=" + limit : "") + 
            (orderby !== undefined ? "&orderby=" + orderby : "") + 
            (direction !== undefined ? "," + direction : "");
        _xdr( url, "get", undefined, function(resp) {
            callback(resp) 
        });
    };

    /**
     * __GET http://api.jotform.com/report/{reportID}/__
     * ----
     */
    root.getReport = function(reportID, callback, errback) {
        if (_apiKey === undefined || _apiKey === null) {
            root.login(function() {
                root.getReport(reportID, callback, errback);
            });
            return;
        }
        if (typeof reportID !== 'string') {
            console.error("Report ID should be string");
            return;
        }
        _xdr( _requestURL + "/report/" + reportID + "?apiKey=" + _apiKey, "get", undefined, function(resp) {
            callback(resp) 
        }, errback);         
    };

    /**
     * __GET http://api.jotform.com/folder/{submissionID}/__
     * ----
     */
    root.getFolder = function(folderID, callback, errback) {
        if (_apiKey === undefined || _apiKey === null) {
            root.login(function() {
                root.getFolder(folderID, callback, errback);
            });
            return;
        }
        if (typeof folderID !== 'string') {
            console.error("Folder ID should be string");
            return;
        }
        _xdr( _requestURL + "/folder/" + folderID + "?apiKey=" + _apiKey, "get", undefined, function(resp) {
            callback(resp) 
        }, errback);         
    };

    /**
     * __POST http://api.jotform.com/form/{formID}/submissions__
     * ----
     */
    root.createFormSubmission = function(formID, submission, callback, errback) {
        if (_apiKey === undefined || _apiKey === null) {
            root.login(function() {
                root.createFormSubmission(formID, submission, callback, errback);
            });
            return;
        }
        if (typeof formID !== 'string') {
            console.error("Form ID should be string");
            return;
        }
        if (typeof submission !== 'object') {
            console.error("Submission (second argument) should be object");
            return;
        }
        _xdr( _requestURL + "/form/" + formID + "/submissions?apiKey=" + _apiKey, "post", JSON.stringify(submission), function(resp) {
            callback(resp) 
        }, errback); 
    };

    /**
     * __POST http://api.jotform.com/form/{formID}/webhooks__
     * ----
     */
    root.createFormWebhook = function(formID, webHookUrl, callback, errback) {
        if (_apiKey === undefined || _apiKey === null) {
            root.login(function() {
                root.createFormWebhook(formID, webHookUrl, callback, errback);
            });
            return;
        }
        if (typeof formID !== 'string') {
            console.error("Form ID should be string");
            return;
        }
        if (typeof webHookUrl !== 'string') {
            console.error("WebHookURL (second argument) should be string");
            return;
        }
        var request = _createCORSRequest("post", _requestURL + "/form/" + formID + "/webhooks?apiKey=" + _apiKey);
        var dataString = "webhookURL=" + webHookUrl;
        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        if (request) {
            request.onload = function(resp) {
                var content = JSON.parse(request.responseText).content;
                callback(content);
            };
            request.send(dataString);
        }
    };

    /**
     * Implementation for helper functions begins here
     * -----------------------------------------------
     */
    function _createCORSRequest(method, url) {
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {
            xhr.open(method, url, true);
        } else if (XDomainRequest !== undefined) {
            xhr = new XDomainRequest();
            xhr.open(method, url);
        } else {    
            xhr = null;
        }
        return xhr;
    }
    function _xdr(url, method, data, callback, errback) {
        var req;
        
        if(XMLHttpRequest) {
            req = new XMLHttpRequest();
     
            if('withCredentials' in req) {
                req.open(method, url, true);
                req.onerror = errback;
                req.onreadystatechange = function() {
                    if (req.readyState === 4) {
                        if (req.status >= 200 && req.status < 400) {
                            callback(JSON.parse(req.responseText).content);
                        } else {
                            errback(new Error('Response returned with non-OK status'));
                        }
                    }
                };
                req.send(data);
            }
        } else if(XDomainRequest) {
            req = new XDomainRequest();
            req.open(method, url);
            req.onerror = errback;
            req.onload = function() {
                callback(req.responseText);
            };
            req.send(data);
        } else {
            errback(new Error('CORS not supported'));
        }
    }
    function _getWindowDimensions() {
        var viewportwidth,
            viewportheight;
         // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
        if (window.innerWidth !== undefined) {
            viewportwidth = window.innerWidth;
            viewportheight = window.innerHeight;
        } else if (document.documentElement !== undefined && document.documentElement.clientWidth !== undefined && document.documentElement.clientWidth !== 0) {
            viewportwidth = document.documentElement.clientWidth;
            viewportheight = document.documentElement.clientHeight;
        } else {
            viewportwidth = document.getElementsByTagName('body')[0].clientWidth;
            viewportheight = document.getElementsByTagName('body')[0].clientHeight;
        }
        return {
            width: viewportwidth,
            height: viewportheight
        };
    };
    /** http://www.onlineaspect.com/2010/01/15/backwards-compatible-postmessage/ **/
    var XD = function() {
        var interval_id,
            last_hash,
            cache_bust = 1,
            attached_callback,
            window = this;
        return {
            postMessage : function(message, target_url, target) {
                if (!target_url) {
                    return;
                }
                target = target || parent;  // default to parent
                if (window.postMessage) {
                    // the browser supports window.postMessage, so call it with a targetOrigin
                    // set appropriately, based on the target_url parameter.
                    target.postMessage(message, target_url.replace( /([^:]+:\/\/[^\/]+).*/, '$1' ) );
                } else if (target_url) {
                    // the browser does not support window.postMessage, so use the window.location.hash fragment hack
                    target.location = target_url.replace(/#.*$/, '') + '#' + (+new Date) + (cache_bust++) + '&' + message;
                }
            },
            receiveMessage : function(callback, source_origin) {
                // browser supports window.postMessage
                if (window.postMessage) {
                    // bind the callback to the actual event associated with window.postMessage
                    if (callback) {
                        attached_callback = function(e) {
                            if ((typeof source_origin === 'string' && e.origin !== source_origin)
                                    || (Object.prototype.toString.call(source_origin) === "[object Function]" && source_origin(e.origin) === !1)) {
                                return !1;
                            }
                            callback(e);
                        };
                    }
                    if (window['addEventListener']) {
                        window[callback ? 'addEventListener' : 'removeEventListener']('message', attached_callback, !1);
                    } else {
                        window[callback ? 'attachEvent' : 'detachEvent']('onmessage', attached_callback);
                    }
                 } else {
                     // a polling loop is started & callback is called whenever the location.hash changes
                     interval_id && clearInterval(interval_id);
                     interval_id = null;
                     if (callback) {
                         interval_id = setInterval(function() {
                             var hash = document.location.hash,
                             re = /^#?\d+&/;
                             if (hash !== last_hash && re.test(hash)) {
                                 last_hash = hash;
                                 callback({data: hash.replace(re, '')});
                             }
                         }, 100);
                     }
                 }
             }
        };
    }();
    function removeElement(EId)
    {
        return (EObj = document.getElementById(EId)) ? EObj.parentNode.removeChild(EObj) : false;
    }
    XD.receiveMessage(function(message){

        removeElement("jotform_oauth_frame_mask");
        var key = message.data;
        if(!key){
            if(typeof root.unsuccessfulLoginCallback === 'function'){
                root.unsuccessfulLoginCallback();
            }            
            return;
        }
        JF.initialize({apiKey: message.data});

        if(typeof root.successfulLoginCallback === 'function'){
            root.successfulLoginCallback();
        }
    }, _baseURL);
    function _createCookie(name,value,days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            var expires = "; expires="+date.toGMTString();
        }
        else var expires = "";
        document.cookie = name+"="+value+expires+"; path=/";
    }
    function _readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }
    function _eraseCookie(name) {
        _createCookie(name,"",-1);
    }

    return root;

})(JF || {});