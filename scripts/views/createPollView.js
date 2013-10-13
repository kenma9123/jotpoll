var CreatePollView = Backbone.View.extend({
    el: '.create-poll-container',
    events: {
        'mouseout .optionList .remove_btn': 'hideRemoveBtn',
        'mouseenter .optionList .remove_btn': 'showRemoveBtn',
        'mouseout .optionList .input_field': 'hideRemoveBtn',
        'mouseenter .optionList .input_field': 'showRemoveBtn',
        'click .wrapper-dropdown-1' : 'dropdown',
        'click #add_more_btn': 'addAnswer',
        'click .optionList .remove_btn': 'removeAnswer',
        'click #create_poll' : 'createPoll'
    },

    initialize: function()
    {
        var self = this;

        //create model
        this.global.createPollModel = new CreatePollModel();

        //modify parent
        this.$el.parents(".container").addClass('createPoll');

        //remove siblings
        this.$el.parents('.hero-unit').show().siblings().remove();

        Backbone.on('call-createPollView', function(){
            self.render();
        });

        this.on('rendered', function(){
            self.initDropdown();
        });
    },

    render: function()
    {
        $(this.el).html( renderTemplate('templates/createPoll.html') );

        this.trigger('rendered', this);

        return this;
    },

    initDropdown: function()
    {
        var DropDown = function()
        {
            this.init = function(el)
            {
                this.inputHidden = $(".question_type #question_type")
                this.dd = el;
                this.placeholder = this.dd.children('span');
                this.opts = this.dd.find('ul.dropdown > li');
                this.val = '';
                this.index = -1;
                this.initEvents();
            };

            this.initEvents = function()
            {
                var obj = this;
                obj.dd.on('click', function(event){
                    $(this).toggleClass('active');
                    return false;
                });

                obj.opts.on('click',function(){
                    var opt = $(this);
                    obj.val = opt.text();
                    obj.index = opt.index();
                    obj.placeholder.text(obj.val);
                    obj.inputHidden.val(opt.attr('data-val'));
                });
            };

            this.getValue = function() {
                return this.val;
            };

            this.getIndex = function() {
                return this.index;
            };
        };

        var dd = new DropDown();
            dd.init( $('#dd') );
    },

    dropdown: function(e)
    {
        var el = e.target;

        $(el).removeClass('active');
    },

    addAnswer: function(e)
    {
        var el = $(e.target)
          , cont = el.parents('.question_answers')
          , optList = $('ol.optionList', cont);

        var input = $('<input/>', {
                'type': 'text',
                'name': 'answers[]',
                'id': 'option' + optList.children().length,
                'placeholder': 'Add an answer',
                'autocomplete': 'off',
                'data-required': 'yes'
            }).addClass('input_field')
          , div = $('<div/>').addClass('remove_btn dn').html('&#10006;')
          , li = $('<li/>').append(input).append(div);

        optList.append(li);

        //focus to appended element
        input.focus();

        this.handleAddAnswerBtn();
    },

    handleAddAnswerBtn: function()
    {
        var el = $("#add_more_btn")
          , cont = el.parents('.question_answers')
          , optList = $('ol.optionList', cont)
          , total_answer = optList.children().length;

        this.global.createPollModel.set('total_answers', total_answer);

        if ( total_answer >= this.global.createPollModel.get('max_answers') )
        {
            el.hide();
        }
        else
        {
            el.show();
        }
    },

    formHasErrors: function(form)
    {
        var required = form.find('*[data-required=yes]')
          , errors = [];

        required.each(function(index, node){
            var name = $(this).attr('name')
              , val = $(this).val();

            switch( name )
            {
                case 'question_type':
                console.log(val);
                    if ( val == '' || !val ) {
                        errors.push("Question type is required");
                    }
                break;
                case 'question_title':
                    if ( val == '' || !val ) {
                        errors.push("Question name is required");
                    }
                    if ( val.length > 100 ) {
                        errors.push("Question name should only be less than 100 characters");
                    }
                break;
                case 'answers[]':
                    if ( val == '' || !val ) {
                        errors.push("Answer at number " + ( index - 1 ) + " is missing" );
                    }
                break;
            }
        });

        $(".errors_cont").empty();

        if ( errors.length > 0 )
        {
            var errorsStr = errors.join('<br/>');
            $(".errors_cont").html(errorsStr);
            return true;
        }
        else
        {
            return false;
        }
    },

    generatePollLink: function(pollData)
    {
        var self = this;

        self.showMessage("<p>Creating link for JotPoll, please wait...</p>");
        this.handleAddAnswerBtn();

        setTimeout(function(){
            self.global.chartOptionsView.handle_Bars_Markers_total(self.global.createPollModel.get('total_answers'));

            self.global.generateView.generate(pollData.message.id, 1, function(generatedUrl, generatedId){

                var html = '<div class="results"><h2>Success!</h2>'
                  , links = [
                        {name:'JotForm link', url: pollData.message.url },
                        {name:'JotPoll result link', url: generatedUrl },
                        // {name:'JotPoll customize link', url: window.location.origin + window.base + 'edit/' + generatedId}
                    ];

                for( var x = 0; x < links.length; x++ )
                {
                    html +=
                        '<div class="result_links">' +
                            '<div class="links">' + links[x].name + '</div>' +
                            '<div class="links input">' +
                                '<input type="text" class="fields" value="' + links[x].url + '" onclick="this.select();"/>' +
                            '</div>' +
                            '<div class="clearer"></div>' +
                        '</div>';
                }


                html += '</div>';

                self.showMessage(html);
            });
        },2000);
    },

    createPoll: function(e)
    {
        var el = e.target
          , self = this
          , form = $(el).parents('#create_question_form')
          , form_val = 'action=createPoll&' + form.serialize();

        if ( this.formHasErrors(form) ) {
            return false;
        }

        this.showMessage('<p>Creating form with JotForm, please wait...</p>');

        $.ajax({
            url: 'server.php',
            type: 'POST',
            data: form_val,
            success: function(response)
            {
                console.log(response);
                if ( response.success == true )
                {
                    self.generatePollLink(response);
                }
            },
            error: function(errors)
            {
                console.log(errors);
            }
        });

        return false;
    },

    showMessage: function(msg)
    {
        $(".poll_result_cont").html(msg);
    },

    removeAnswer: function(e)
    {
        $(e.target).parent().remove();

        this.handleAddAnswerBtn();
    },

    showRemoveBtn: function(e)
    {
        $('.remove_btn', $(e.target).parent()).removeClass('dn').addClass('ib');
    },

    hideRemoveBtn: function(e)
    {
        $('.remove_btn', $(e.target).parent()).removeClass('ib').addClass('dn');
    }
});