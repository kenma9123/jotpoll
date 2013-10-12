<?php
    require_once("lib/header.php");
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <?=PAGE_HEAD?>
    <title><?=PAGE_TITLE?></title>
    <?=PAGE_STYLES?>
</head>
<body>
    <div id="application_landing">
        <div class="slides-background">
            <header id="header">
                <div class="header">
                    <div class="header-content">
                        <a href="/" class="logo-link">
                            <img src="css/images/jotformDevLogo.png" alt="JotForm Developers">
                        </a>
                    </div>
                </div>
            </header>
            <div class="content-container">
                <div class="content">
                    <div class="banner-area">
                        <div class="banner-content">
                            <div class="title">Show your poll results in a cool way!</div>
                            <div class="banner-text">Want to show some cool poll stuff after a submission? Tired of seeing normal and not so good polls? Now its your time to shine! Show your users a good poll result using your own style. Customize your own polls and let the world of poll change yours. Please look at the **How to** section and how to properly use the application. </div>
                        </div>
                        <div class="visual">
                            <p><img src="css/images/jotpoll.png" alt=""></p>
                        </div>
                        <div class="integrate_btn">
                            <button class="btn btn-large btn-block btn-success" id="integrate_now-btn">Integrate Now!</button>  </div>
                    </div>
                </div>
            </div>
            <footer class="footer" id="footer">
                <div class="tm">
                    <span>Powered by </span>
                    <span><a href="http://www.jotform.com">JotForm</a></span>
                    <span class="app-g"><a href="http://apps.jotform.com">JotForm Apps</a></span>
                </div>
            </footer>
        </div>
    </div>

    <div class="jmain navbar navbar-inverse navbar-fixed-top dn" style="position: absolute;">
        <div class="navbar-inner">
          <div class="container">
            <button type="button" class="btn btn-navbar" data-toggle="collapse" data-target="#nav-collapse-01"></button>
            <span class="brand">
                <span class="title-name"><h1><?=JOTPOLL_NAME?></h1></span>&nbsp;<i class="icon-bar-chart"></i></span>
            <div class="nav-collapse collapse" id="navigation-bar">
              <ul class="nav">
                <li></li>
                <li id="home" class="active"><a href=".">Home</a></li>
                <li id="howto"><a href="howto.php">How it Works</a></li>
                <li id="create"><a href="create">Create Poll</a><label class="teaser">Coming soon</label></li>
                <!-- <li ><a href="javascript:void(0);">Widgets</a><label class="teaser">Coming soon</label></li> -->
              </ul>
            </div>
            <div class="account-navigation"></div>
          </div>
        </div>
    </div>

    <div class="jmain container main-content dn">
        <div class="alert alert-block alert-error dn">
            <button type="button" class="close" data-dismiss="alert">×</button>
            <div class="alert-content">
                <h2 class="alert-heading">Authorization Error!</h2>
                <p>Please login to authorize the Application. Don't have an account yet? Join Us <a href="http://www.jotform.com/" title="JotForm">here</a>.</p>
                <p>
                  <button class="btn btn-mini btn-danger" onclick="window.location.reload();" type="button">Reload Page</button>
                </p>
            </div>
        </div>
        <div class="hero-unit dn">
            <div class="poll-panel" style="border-bottom: 1px solid #BBB;padding: 0px;">
                <div class="poll-panel-inner">
                    <p class="poll-subtitle" style="font-size: 17px;line-height: 25px;display: block;font-weight: normal;">
                        Just a few steps away to create a super beautiful Poll!<br>
                        - Pick your form, pick the question you want to show as Poll and click Generate button to generate a URL you can visit.<br>
                        - Play with the options below for better results.<br>
                        <i>Note: one poll to one form question at a time.</i>
                    </p>
                </div>
            </div>
            <div id="poll-mainContainer-B" class="poll-result-container">
                <div class="poll-divisions poll-navigator"></div>
                <div class="poll-divisions poll-code-generator"></div>
                <div class="clear-fix"></div>
            </div>
        </div>
        <div class="hero-unit dn">
            <div id="poll-mainContainer-A" class="poll-result-container">
                <div class="poll-divisions poll-chart-options"></div>
                <div class="poll-divisions poll-chart-preview"></div>
                <div class="clear-fix"></div>
            </div>
        </div>
        <div class="hero-unit dn">
            <div class="poll-results-graph"></div>
        </div>
        <div class="hero-unit dn">
            <p style="line-height: 20px;text-align: center;padding: 50px 0px 0px 0px;">
                Simply create a Poll to JotForm without leaving JotPoll.<br/>
                The default type of question to be use is "Radio buttons".
            </p>
            <form id="create_question_form" name="create_question" method="post" action="" onSubmit="return false;">
                <div class="create-poll-container">
<!--                     <div class="question_type">
                        <h1>Question Type</h1>
                        <p class="sub-heading">Select your question type.<br>This is necessary beause we're dealing with <i>Forms</i>.<br/>Note: Only supports Dropdown and Radio type questions</p>
                        <div class="input_division">
                            <div class="wrapper-dropdown">
                            <div id="dd" class="wrapper-dropdown-1" tabindex="1">
                                <span>Type</span>
                                <ul class="dropdown">
                                    <li data-val="control_rating"><a href="javascript:void(0);">Star Rating</a></li>
                                    <li data-val="control_scale"><a href="javascript:void(0);">Scale Rating</a></li>
                                    <li data-val="control_dropdown"><a href="javascript:void(0);">Dropdown</a></li>
                                    <li data-val="control_radio"><a href="javascript:void(0);">Radio</a></li>
                                </ul>
                                <input type="hidden" id="question_type" name="question_type" data-required="yes"/>
                            </div>
                            </div>
                        </div>
                    </div> -->
                    <div class="question_name">
                        <h1>Create a Question</h1>
                        <p class="sub-heading">Name your question with 100 characters less.<br/><i>Note</i>: Question name will be set as your Form name.</p>
                        <div class="input_division">
                            <textarea class="textarea_field" name="question_title" id="question_title" placeholder="Your question" autocomplete="off" data-required="yes"></textarea>
                        </div>
                    </div>
                    <div class="question_answers">
                        <h1>Answers</h1>
                        <p class="sub-heading">Add answers to your question.<br/>With a minimum of 2 and a maximum of 5 anwers.</p>
                        <ol class="optionList">
                            <li>
                                <input name="answers[]" id="option1" type="text" placeholder="Add an answer" autocomplete="off" class="input_field" data-required="yes"/>
                            </li>
                            <li>
                                <input name="answers[]" id="option2" type="text" placeholder="Add an answer" autocomplete="off" class="input_field" data-required="yes"/>
                            </li>
                            <li>
                                <input name="answers[]" id="option3" type="text" placeholder="Add an answer" autocomplete="off" class="input_field" data-required="yes"/>
                                <div class="remove_btn dn">&#10006;</div>
                            </li>
                        </ol>
                        <div class="add_more">
                            <button class="btn btn-danger" id="add_more_btn">Add question</button>
                            <div class="clearer"></div>
                        </div>
                    </div>
                    <div class="create_question">
                        <div class="button_container">
                            <button class="btn btn-large btn-block btn-primary" id="create_poll">Create Poll</button>
                        </div>
                        <div class="errors_cont"></div>
                        <div class="poll_result_cont"></div>
                    </div>
                </div>
            </form>
        </div>
    </div>

    <?=PAGE_SCRIPTS?>

    <!-- Google Analytics Code -->
    <script type="text/javascript">

          var _gaq = _gaq || [];
          _gaq.push(['_setAccount', 'UA-1170872-7']);
          _gaq.push(['_setDomainName', 'jotform.com']);
          _gaq.push(['_setAllowLinker', true]);
          _gaq.push(['_trackPageview']);

          (function() {
            var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
            ga.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'stats.g.doubleclick.net/dc.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
          })();

     </script>

    <script src="http://cdn.jotfor.ms/static/feedback2.js?3.1.12" type="text/javascript">
        new JotformFeedback({
            formId     : "32124156488960",
            buttonText : "Feedbacks",
            base       : "http://jotformpro.com/",
            background : "#F59202",
            fontColor  : "#FFFFFF",
            buttonSide : "bottom",
            buttonAlign: "right",
            type       : false,
            width      : 700,
            height     : 500
        });
    </script>
</body>
</html>
