/**
 * QuestionPicker.js 2.0
 *
 *  (c) 2013 JotForm Easiest Form Builder
 *
 * QuestionPicker.js may be freely distributed under the MIT license.
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
 * Include FormPicker.js script to your page
 * __<script src="http://js.jotform.com/FormPicker.js"></script>__
 *   
 * Include JotFormFormPicker.js script to your page
 * __<script src="http://js.jotform.com/QuestionPicker.js"></script>__
 */

(function(base){

    var QuestionPicker = function()
    {
        this.settings = {
            title: 'Question Picker',
            overlayCSS: 'http://js.jotform.com/css/JotFormWidgetsCommon.css',
            modalCSS: 'http://js.jotform.com/css/JotFormQuestionPicker.css',
            onSelect: function(){},
            onReady: function(){},
            onClose: function(){},
            onLoad: function(){}
        };

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

            if ( container.querySelectorAll('.jf-mask').length > 0 ) return;

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
                var sq = JSON.parse(self.selectedQuestions);
                var qs = [];
                JF.getFormQuestions(self.formData.id, function(resp) {
                    for(var i=0; i<sq.length; i++) {
                        var r = sq[i].split('_')[1];
                        qs.push(resp[r]);
                    }
                    options.onSubmit(qs);
                    self.removeElement('jotform_modal');
                })
            };

            //Add submit to footer
            modalFooter.appendChild(submitButton);

            //wrap everything
            wrapperDiv.appendChild(modalHeader);
            wrapperDiv.appendChild(modalContent);
            wrapperDiv.appendChild(modalFooter);
               
            if(options.content !== undefined) {
                modalContent.innerHTML = options.content;
            }

            iWindow.addEventListener('message',function(event) {
                if(event.data.match(/setHeight/) === null) {
                    options.onMessage.call(options.scope, event.data);
                } else {
                    var height = event.data.split(':')[1];
                    doc.getElementById('jotform_qp_frame').style.height = height + 'px';
                }
            },false);  

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
                options.onRender(self.widgetWindow, self.widgetDocument);
                options.onReady();
            });
        };

        this.initialize = function()
        {
            var self = this;

            self.buildModalBox({
                content : '<div class="jf-loading-state"><div id="jf-loading-text">Loading Questions, please wait...</div></div>',
                onRender: function(iWindow, iDoc)
                {
                    //get the form data
                    base.getForm(self.formID, function(response) {
                        //console.log("QP Form Data", response);

                        self.formData = response;

                        var frame = document.createElement('iframe')
                          , ref = document.location.href
                          , REFERER = self.formData.url +  "&qp=true&ref=" + encodeURIComponent(ref);

                        frame.setAttribute("src", REFERER);
                        frame.setAttribute("id", "jotform_qp_frame");
                        frame.setAttribute("name", "jotform_qp_frame");
                        frame.setAttribute("scrolling", "no");
                        frame.style.width = '100%';
                        frame.style.backgroundColor = "white";
                        frame.style.border = "none";

                        var content_el = iDoc.querySelector('.jf-modal-content');
                        content_el.innerHTML = frame.outerHTML;

                    }, function() {
                        throw new Error('Form not found');
                    });
                },
                onSubmit : self.settings.onSelect,
                onReady : self.settings.onReady,
                onClose : self.settings.onClose,
                onMessage : function(msg) {
                    //console.log("Got Questions!!", msg);
                    self.selectedQuestions = msg;
                }
            });
        };

        this.stopLoading = function(iDoc, errmsg)
        {
            //console.log(iDoc);
            //console.log(errmsg);
            var loading = iDoc.querySelector('.jf-loading-statey');
            //console.log(loading);
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

        this.init = function(formID, options)
        {
            var self = this;
            this.formID = formID;
            this.settings = this.extend({}, this.settings, options);
            this.selectedQuestions = [];
            //console.log("THis form ID is ", this.formID);
            this.loadCSS(document, this.settings.overlayCSS, function(){
                self.initialize();
            });
        };
    };

    base.QuestionPicker = function(formID, options)
    {

        if ( typeof formID === 'object' ) {
            options = formID;
            formID = null;
        }

        if ( !formID || formID.length == 0 || typeof formID === 'undefined' )
        {
            //check if they use the old method that formID is in options
            if ( options.formId || typeof options.formId !== 'undefined' ) {
                formID = options.formId;
            } else {
                throw "Form ID is missing";
                return;
            }
        }

        //console.log("THis form ID is ", formID);
        var _q_picker = new QuestionPicker();
            _q_picker.init(String(formID), options);

        console.log("Q-picker", _q_picker);
    };
})(JF || {});