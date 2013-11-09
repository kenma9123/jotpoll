<?php
    require_once("lib/header.php");
    $users = User::countUsers();
    $user_count = ( count($users) > 0 ) ? (number_format($users) . ' users trust ' . JOTPOLL_NAME) : '';
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
                <li id="create"><a href="create">Create Poll<label class="teaser new">New</label></a></li>
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
        <div class="hero-unit dn main">
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
                <div class="clear-fix"></div>
                <div class="poll-divisions poll-code-generator"></div>
                <div class="clear-fix"></div>
                <div class="poll-divisions poll-chart-options"></div>
                <div class="clear-fix"></div>
            </div>
            <div id="poll-mainContainer-A" class="poll-result-container">
                <div class="poll-divisions poll-chart-preview"></div>
                <div class="clear-fix"></div>
            </div>
            <div class="clear-fix"></div>
        </div>
        <div class="hero-unit dn view">
            <div class="poll-results-graph"></div>
        </div>
        <div class="hero-unit dn create">
            <div class="create-poll-container"></div>
        </div>
    </div>
    <div class="jotpoll-footer dn">
        <div >
            <p class="infos bignames">
                <a href="http://www.jotform.com/" title="JotForm - Form builder" alt="jotform" target="_blank">JotForm</a> | 
                <a href="http://www.jotpoll.com/" title="JotPoll" alt="jotpoll" target="_blank">JotPoll</a>
            </p>
            <p class="infos owner">
                © 2013 <a href="http://www.google.com/recaptcha/mailhide/d?k=01zXnyZ97-oLOl4pY5AuarnA==&amp;c=-aqY40GERMz4XMdaOID1yIcIk9_F6i3S2ktFRrlTzng=" onclick="window.open('http://www.google.com/recaptcha/mailhide/d?k\07501zXnyZ97-oLOl4pY5AuarnA\75\75\46c\75-aqY40GERMz4XMdaOID1yIcIk9_F6i3S2ktFRrlTzng\075', '', 'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=0,width=500,height=300'); return false;" title="Reveal this e-mail address">Kenneth Palaganas</a>
                <br/><span style="font-size: 9px;">JotForm Developer</span><br/>
                <span style="font-size: 9px;"><?=$user_count?></span>
            </p>
        </div>
    </div>

    <ol id="joyRideTipContent">
      <li data-class="poll-navigator" data-button="Next" data-options="tipLocation:top;tipAnimation:fade">
        <h2>Pick!</h2>
        <p>This section is your first step to get things started!</p>
      </li>
      <li data-id="pickFormWidget" data-button="Next" data-options="tipLocation:right;tipAnimation:fade">
        <h2>Form</h2>
        <p>pick the Form on where to pull questions</p>
      </li>
      <li data-id="pickQuestionWidget" data-button="Next" data-options="tipLocation:right;tipAnimation:fade">
        <h2>Question</h2>
        <p>pick the Question you wanted to use as the Poll</p>
      </li>
      <li data-id="proceedButton" data-button="Next" data-options="tipLocation:right;tipAnimation:fade">
        <h2>Proceed!</h2>
        <p>and if everything is fine, click this button and we'll do the rest.</p>
      </li>
      <li data-id="generatedFormData" data-button="Next" data-options="tipLocation:right;tipAnimation:fade">
        <h2>Result</h2>
        <p>as a result, the generated URL can be found here.</p>
      </li>
      <li data-id="copyToClipboard" data-button="Next" data-options="tipLocation:bottom;tipAnimation:fade">
        <h2>Result</h2>
        <p>you can copy it to clipboard</p>
      </li>
      <li data-id="visitLinkButton" data-button="Next" data-options="tipLocation:bottom;tipAnimation:fade">
        <h2>Result</h2>
        <p>or visit the link to test. And if everything looks fine you're ready to share your Poll. As simple as that</p>
      </li>
      <li data-class="chart-options" data-button="Next" data-options="tipLocation:right;tipAnimation:fade">
        <h2>But wait! There's more!</h2>
        <p>If you're not fan of default values, this section is for you.</p>
      </li>
      <li data-id="bar-color-settings" data-button="Next" data-options="tipLocation:right;tipAnimation:fade">
        <h2>Bar colors</h2>
        <p>you can customize the bar colors from here! cooool eh?</p>
      </li>
      <li data-id="bar-common-settings" data-button="Next" data-options="tipLocation:right;tipAnimation:fade">
        <h2>Others Settings</h2>
        <p>and some other options that you want to play with</p>
      </li>
      <li data-class="chart-preview" data-button="Next" data-options="tipLocation:top;tipAnimation:fade">
        <h2>Preview</h2>
        <p>now this super wide section is the preview window. From here, you can see your changes in real time!</p>
      </li>
      <li data-id="logout" data-button="Next" class="logout-tour" data-options="tipLocation:top;tipAnimation:fade;nubPosition:right;">
        <h2>Logout</h2>
        <p>if you want to switch account or just feel to logout, it is possible from here.</p>
      </li>
      <li data-id="create" data-button="Close" data-options="tipLocation:top;tipAnimation:fade">
        <h2>One more thing</h2>
        <p>Finally! You can create polls from here</p>
      </li>
    </ol>

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

     <?=$feedback?>
</body>
</html>
