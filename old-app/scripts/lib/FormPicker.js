/**
 * FormPicker.js 2.0
 *
 *  (c) 2013 JotForm Easiest Form Builder
 *
 * FormPicker.js may be freely distributed under the MIT license.
 * For all details and documentation:
 * http://api.jotform.com
 */

/*
 * INITIAL SETUP
 * =============
 *
 * Include JotForm.js script to your page
 * __<script src="http://js.jotform.com/JotForm.js"></script>__
 *   
 * Include JotFormFormPicker.js script to your page
 * __<script src="http://js.jotform.com/FormPicker.js"></script>__
 */

(function (base) {

    var FormPicker = function()
    {
        this.settings = {
            offset: 0,
            limit: 100,
            sort: 'updated_at',
            sortType: 'DESC',
            filter: {status : 'ENABLED'},
            multiSelect: false,
            overlayCSS: 'http://js.jotform.com/css/JotFormWidgetsCommon.css',
            modalCSS: 'http://js.jotform.com/css/JotFormFormPicker.css',
            showPreviewLink: false,
            title: 'Form Picker',
            initial_data: false,
            onSelect: function(){},
            onReady: function(){},
            onClose:function(){},
            onLoad: function(){}
        };

        this.listTemplate = 
            '<li class="jf-form-list-item" id="<%=id%>">' + 
                '<div><div class="jf-checkbox-icon"></div></div>' +
                '<div class="jf-form-status">' +
                    '<div class="jf-form-icon"></div>' +
                    '<span style="display: <%=unread > 0 ? "block" : "none"%> "class="jf-unread"><%=unread%></span>' +
                '</div>' +
                '<div title="<%=title%>" class="jf-form-title">' +
                    '<%=title%>' +
                    '<span class="jf-form-link"><a style="display:<%=previewLink%>;" href="<%=url%>" target="_blank">Preview</a></span>' +
                '</div>' +
                '<div class="jf-form-info">' +
                    '<span><b><%=count%></b> Submissions.</span>' +
                    '<span><b>Created</b> on <%=created_at%> </span>' +
                    '<span><%=(updated_at) ? "<b>Last activity on</b> " + updated_at : "" %></span>' +
                '</div>' +
            '</li>';

        this.loadCSS = function(docEl, url, onLoad)
        {
            //check if css already included
            var ss = document.styleSheets;
            for (var i = 0, max = ss.length; i < max; i++) {
                var currSS = null;
                if (ss[i] && ss[i].href && String(ss[i].href).indexOf('?rev=') > -1) {
                    currSS = String(ss[i].href).split('?rev=')[0];
                }
                if (currSS == url) {
                    onLoad();
                }
            }

            var styleElement = document.createElement('link');
            styleElement.setAttribute('type', 'text/css');
            styleElement.setAttribute('rel', 'stylesheet');
            styleElement.setAttribute('href', url + '?rev=' + new Date().getTime());
            docEl.getElementsByTagName('head')[0].appendChild(styleElement);

            if (styleElement.readyState) { //IE
                styleElement.onreadystatechange = function () {
                    if (styleElement.readyState == "loaded" || styleElement.readyState == "complete") {
                        styleElement.onreadystatechange = null;
                        onLoad();
                    }
                };
            } else { //Others
                //if safari and not chrome, fire onload instantly - chrome has a safari string on userAgent
                //this is a bug fix on safari browsers, having a problem on onload of an element
                if (navigator.userAgent.match(/safari/i) && !navigator.userAgent.match(/chrome/i)) {
                    onLoad();
                } else {
                    styleElement.onload = function () {
                        onLoad();
                    };
                }
            }
        };

        this.loadJS = function(docEl, src, docWindow)
        {
            var self = this
              , s = docEl.createElement( 'script' );

            var ucfirst = function (str) {
                str += '';
                var f = str.charAt(0).toUpperCase();
                return f + str.substr(1);
            };

            s.setAttribute( 'src', src );
            docEl.body.appendChild( s ); 
            s.onload = s.onreadystatechange = function(){ 
                //load eventtarget/template script
                var s2 = docEl.createElement( 'script' );
                s2.setAttribute( 'src', 'http://js.jotform.com/vendor/Tools.js' );
                docEl.body.appendChild( s2 );  
                s2.onload = s2.onreadystatechange = function() {
                    //waits for dom/script load
                    var timer = setInterval(function(){
                        if(docWindow.formList === undefined) {
                        } else {
                            clearInterval(timer);
                            docWindow.target = new docWindow.EventTarget();

                            var markup ='<div class="jf-form-list-wrapper">' +
                                '<ul class="jf-form-list">'; 

                            for (var i = 0; i < docWindow.formList.length; i++)
                            {
                                var form = docWindow.formList[i]
                                  , date_updated = String(form['updated_at']).split(' ')
                                  , date_created = String(form['created_at']).split(' ');
                                form['updated_at'] = (form['updated_at']) ? date_updated[0] : false;
                                form['created_at'] = date_created[0];
                                form['unread'] = form['new'];
                                form['previewLink'] = (self.settings.showPreviewLink === false) ? 'none' : 'inline';
                                var item = docWindow.tmpl(self.listTemplate, form);
                                markup = markup + item;
                            }

                            markup = markup + '</ul>' + '</div>';
                            docWindow.$(".jf-modal-content").html(markup);

                            var settings = docWindow.widgetOptions;
                            docWindow.$(docEl.body).find('.jf-form-list-item').click(function(el) {
                                if(!settings.multiSelect) {
                                    docWindow.$(docEl.body).find('.active').removeClass('active');
                                    docWindow.$('.jf-checkbox-icon', this).addClass('active');
                                    docWindow.$(docEl.body).find('.jf-form-list-item').removeClass('selected');
                                    docWindow.$(this).addClass('selected');
                                    return;
                                }

                                docWindow.$(this).toggleClass('selected');
                                docWindow.$('.jf-checkbox-icon', this).toggleClass('active');
                            });      

                            //on load function after all the list rendered
                            self.settings.onLoad(docWindow.formList, markup);          
                        }
                    },400); //IE needs a little more time to load the script
                }
                //after jQuery loaded
                //TODO: ready function when all scripts loaded
                // $(function(){
                // });
            };
        };

        this.getIframeDocument = function(iframe)
        {
            var doc;
            if(iframe.contentDocument)
              // Firefox, Opera
               doc = iframe.contentDocument;
            else if(iframe.contentWindow)
              // Internet Explorer
               doc = iframe.contentWindow.document;
            else if(iframe.document)
              // Others?
               doc = iframe.document;
         
            if(doc == null)
              throw "Document not initialized";
            return doc;
        };

        this.getIframeWindow = function(iframe_ob)
        {
            var doc;
            if (iframe_ob.contentWindow) {
              return iframe_ob.contentWindow;
            }
            if (iframe_ob.window) {
              return iframe_ob.window;
            } 
            if (!doc && iframe_ob.contentDocument) {
              doc = iframe_ob.contentDocument;
            } 
            if (!doc && iframe_ob.document) {
              doc = iframe_ob.document;
            }
            if (doc && doc.defaultView) {
             return doc.defaultView;
            }
            if (doc && doc.parentWindow) {
              return doc.parentWindow;
            }
            return undefined;
        };

        this.removeElement = function(EId)
        {
            return(EObj=document.getElementById(EId)) ? EObj.parentNode.removeChild(EObj) : false;
        };

        this.buildModalBox = function(options)
        {
            var self = this
              , container = document.body
              , dimmer = document.createElement('div')
              , frame = document.createElement('iframe');

            frame.className = 'centered';
            frame.setAttribute('id', 'jotform-window');
            dimmer.setAttribute('id', 'jotform_modal');
            dimmer.className = 'jf-mask';
            dimmer.style.display = 'none';
            dimmer.appendChild(frame);
            container.appendChild(dimmer);

            var doc = this.widgetDocument = this.getIframeDocument(frame)
              , iWindow = this.widgetWindow = this.getIframeWindow(frame);
            
            //necessary for FF & IE
            doc.open();
            doc.close();

            //rest of the elements are created in iframe
            var wrapperDiv = doc.createElement('div')
              , modalHeader = doc.createElement('div')
              , modalTitle = doc.createElement('div')
              , modalTitleInner = doc.createElement('h1')
              , modalContent = doc.createElement('div')
              , closeButton = doc.createElement('div')
              , modalFooter = doc.createElement('div')
              , submitButton = doc.createElement('button');

            wrapperDiv.className = 'jf-modal-window';
            modalHeader.className = 'jf-modal-header';
            modalTitle.className = 'jf-modal-title';
            modalContent.className = 'jf-modal-content';

            //append titlename to title container and append them header
            modalTitleInner.className = 'jf-modal-title-inner';
            modalTitleInner.innerHTML = self.settings.title;
            modalTitle.appendChild(modalTitleInner);
            modalHeader.appendChild(modalTitle);

            //close button and append to header
            closeButton.className = 'jf-modal-close';
            closeButton.innerHTML = '&#10006;';
            modalHeader.appendChild(closeButton);

            modalFooter.className = 'jf-modal-footer';
            submitButton.className = 'jotform-modal-submit';

            //innerText is not applicable for FF & IE
            submitButton.innerHTML = 'Continue';

            //deploy closeModal function
            var closeModal = function() {
                self.removeElement('jotform_modal');
                options.onClose();
            };
            
            submitButton.onclick = function() {
                var jq = self.widgetWindow.$;
                var selectedForms = [];
                var forms = self.widgetWindow.formList;
                // content.find('.jf-select-form').click(function(e) {
                // var selectedForms = []
                jq(self.widgetDocument.body).find(".jf-form-list-item.selected").each(function(idx, el){
                    for(var i=0; i<forms.length; i++) {
                        if(forms[i].id === jQuery(el).attr('id')){
                            selectedForms.push(forms[i]);
                        }
                    }
                });
                self.removeElement('jotform_modal');
                options.onSubmit(selectedForms);
            }

            //Add child elements
            modalFooter.appendChild(submitButton);
            wrapperDiv.appendChild(modalHeader);
            wrapperDiv.appendChild(modalContent);
            wrapperDiv.appendChild(modalFooter);
               
            if(options.content !== undefined) {
                modalContent.innerHTML = options.content;
            }

            iWindow.addEventListener('message',function(event) {
                if(event.data.match(/setHeight/) === null) {
                    options.onMessage.call(options.scope, event.data);
                }
            }, false);   

            //append everything to iframe doc body
            doc.body.appendChild(wrapperDiv);

            //close modal once close button is click
            closeButton.onclick = function() {
                closeModal();
            };

            //load the entire modal css
            self.loadCSS(doc, self.settings.modalCSS, function() {
                //show modal
                dimmer.style.display = 'block';

                //call render function together with ready
                options.onRender(self.widgetWindow, self.widgetDocument);
                options.onReady();
            });
        };

        this.createContent = function(settings)
        {
            var self = this;

            this.buildModalBox({
                scope : self,
                content : '<div class="jf-loading-state"><div id="jf-loading-text">Loading Forms, please wait...</div></div>',
                onRender : function(iWindow, iDoc) {
                    //pass widget options
                    iWindow.widgetOptions = settings;

                    var f = document.getElementById('jotform-window')
                      , toolsSrc = "http://js.jotform.com/vendor/jquery-1.9.1.min.js";

                    //pass initial form reports instead of loading it
                    //useful if you check a form has forms and use the data pulled later
                    if ( settings.initial_data !== false ) {
                        // iWindow.formList = resp;
                        iWindow.formList = settings.initial_data;
                        self.loadJS(iDoc, toolsSrc, iWindow);
                    } else {
                        var query = {
                            'offset': settings.offset,
                            'limit': settings.limit,
                            'filter': settings.filter,
                            'orderby': settings.sort,
                            'direction': settings.sortType
                        };
                        base.getForms(query, function(resp) {
                            iWindow.formList = resp;
                            self.loadJS(iDoc, toolsSrc, iWindow);
                        }, function error(){
                            var errmsg = "Something went wrong when fetching Forms, please try again.";
                            self.stopLoading(iDoc, errmsg);
                            throw errmsg;
                        });
                    }
                },
                onSubmit : settings.onSelect,
                onReady : settings.onReady,
                onClose : settings.onClose
            });
        };

        this.stopLoading = function(iDoc, errmsg)
        {
            var loading = iDoc.querySelector('.jf-loading-state #jf-loading-text');
            loading.innerHTML = errmsg;
            loading.className = "jf-loading-stop";
        };

        this.extend = function()
        {
            var a = arguments[0];
            for (var i = 1, len = arguments.length; i < len; i++) {
                var b = arguments[i];
                for (var prop in b) {
                    a[prop] = b[prop];
                }
            }
            return a;
        };

        this.init = function(options)
        {
            this.settings = this.extend({}, this.settings, options);

            this.loadCSS(document, this.settings.overlayCSS, function(){});
            this.createContent(this.settings);
        };
    };

    base.FormPicker = function(options) {
        var _f_picker = new FormPicker();
        _f_picker.init(options);
    }
})(JF || {});