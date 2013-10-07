<?php
    require_once("lib/header.php");
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <?=PAGE_HEAD?>
    <title><?=PAGE_TITLE?> - How it Works</title>
    <?=PAGE_STYLES?>
</head>
<body>
    <div class="navbar navbar-inverse navbar-fixed-top">
        <div class="navbar-inner">
          <div class="container">
            <button type="button" class="btn btn-navbar" data-toggle="collapse" data-target="#nav-collapse-01"></button>
            <span class="brand">
                <span class="title-name"><h1><?=JOTPOLL_NAME?></h1></span>&nbsp;<i class="icon-bar-chart"></i></span>
            <div class="nav-collapse collapse" id="nav-collapse-01">
              <ul class="nav">
                <li></li>
                <li ><a href=".">Home</a></li>
                <li class="active"><a href="howto.php">How it Works</a></li>
                <li ><a href="contact.php">Contact Us</a></li>
              </ul>
            </div>
          </div>
        </div>
    </div>

    <div class="container">
        <div class="hero-unit">
            <div class="poll-panel" style="border-bottom: 1px solid #BBB;padding: 0px;">
                <div class="poll-panel-inner">
                    <h1 class="content-header-name">How it Works</h1>
                </div>
            </div>
            <div id="poll-mainContainer-A" class="how-it-works">
                <div class="list-content">
                    <div class="paragraph">
                        This application will show a nifty poll result after a form submission. It was intented for users who needs a poll or to make their forms generate a poll.<br/>
                        As of now, this application can generate a poll result from a single question ONLY, and it is only compatible with this type of questions.<br/>
                        <br/>
                        - dropdown<br/>
                        - radio button<br/>
                        - star rating<br/>
                        - scale rating<br/>
                        <br/>
                        Each question should have at-least 2 options and a maximum of 5 options only make things work. In the future we will expand this to handles options more than 5.<br/>
                        After you created a form with at least one question then we will going to start how this cool poll works.<br/>
                        <br/>
                        The first thing you may see on the Index page is a mini-dashboard where you can customize your poll look and feel. Currently we are using a Gauge Chart to show Poll results.<br/>
                        You can customize each bars color and background( represents Bar A - Bar E tabs ), show markers, scale, etc. It is limited as of now but we will going to expand it too to have more options.<br/>
                        <br/>
                        Along with the options, there is a preview window next to it where you can see what's your poll should look like.<br/>
                        You can press the "Update Preview" button to manually update the preview window.<br />
                        <div class="images"><img src="http://www.clipular.com/c?12633027=aU-Qg_2Qjp-ABBWGeqEENCS8hCU&f=.png" title="dashboard look" alt="dashboard-look"/></div>
                        <br/>
                        At the very bottom of the page, you have to select your form containing the poll question and then select the question you wanted to show on the poll result later.<br/>
                        Just click the "Generate form URL" and a URL will be created on the text area next to it, you can visit the generated link for testing.<br/>
                        <br/>
                        Your poll should look something like this. It was divided into two divisions, top is your actual poll and the bottom is a legend helper associates with your poll.
                        <div class="images"><img src="http://www.clipular.com/c?12638101=E6X6HE2TXR1EvwhdSHgVwZhbMwU&f=.png" title="Poll Result" alt="poll-result"/></div><br/>
                        Another cool thing is, if you wanted to show the poll results after a submission then you just need to copy the generated URL and make it as your "Thank You" custom URL.
                        <div class="images"><img src="http://www.clipular.com/c?12005006=AAmytse_LaM0W2gRDyJLVGg--hM&f=.png" title="Custom URL" alt="custom-url"/></div>
                        <br/>
                        Here is a simple demo on how the whole process work.<br/>
                        <iframe src="http://www.screenr.com/embed/ahAH" width="650" height="396" frameborder="0"></iframe><br/>
                        <br/>
                    </div>
                </div>
            </div>
        </div>
        <div class="hero-unit">
            <div class="poll-panel" style="border-bottom: 1px solid #BBB;padding: 0px;">
                <div class="poll-panel-inner">
                    <h1 class="content-header-name">Feedbacks</h1>
                </div>
            </div>
            <div id="poll-mainContainer-A" class="how-it-works">
                <div class="list-content">
                    <div class="paragraph">
                        We are in beta testing, we seek help, we need some feedbacks, ideas or improvement to make it even better.<br/>
                        If you do came up with something please don't be shy to share it with us. You can email me directly at kenneth@jotform.com<br/>
                        <br/>
                        Thank you for using both <a href="http://www.jotform.com" title="JotForm">JotForm</a> and <a href="http://www.jotpoll.com" title="JotPoll">JotPoll</a>, have a nice day!<br/>
                        -JotForm Team
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
