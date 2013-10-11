var CreatePollView = Backbone.View.extend({
    el: '.create-poll-container',
    events: {
        'click .wrapper-dropdown-1' : 'dropdown',
        'click #create_poll' : 'createPoll'
    },
    initialize: function()
    {
        //create model
        this.global.createPollModel = new CreatePollModel();

        //modify parent
        this.$el.parents(".container").addClass('createPoll');

        //remove siblings
        this.$el.parents('.hero-unit').show().siblings().remove();

        this.initDropdown();

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

    createPoll: function(e)
    {
        var el = e.target
          , form = $(el).parents('#create_question_form')
          , form_val = 'action=createPoll&' + form.serialize();

        $.ajax({
            url: 'server.php',
            type: 'POST',
            data: form_val,
            success: function(response)
            {
                console.log(response);
            },
            error: function(errors)
            {
                console.log(errors);
            }
        });

        return false;
    }
});