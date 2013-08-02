<?php
    require_once("lib/init.php");
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <?=PAGE_HEAD?>
    <title><?=PAGE_TITLE?> - Contact</title>
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
                <li ><a href="howto.php">How it Works</a></li>
                <li class="active"><a href="contact.php">Contact Us</a></li>
              </ul>
            </div>
          </div>
        </div>
    </div>

    <div class="container">
        <div class="hero-unit">
            <div class="poll-panel" style="border-bottom: 1px solid #BBB;padding: 0px;">
                <div class="poll-panel-inner">
                    <h1 class="content-header-name">Contact Us</h1>
                </div>
            </div>
            <div id="poll-mainContainer-A" class="how-it-works">
                <div class="list-content">
                    <div class="paragraph">
                        JotPoll was created with love and determination<br/>
                        We are in beta testing, we need some feedbacks, ideas or improvement to make it even better.<br/>
                        If you do came up with something please don't be shy to <a href="contact.php">share</a> it with us. Or you can email me at kenma9123@gmail.com<br/>
                        <div class="contact-us">
                            <script type="text/javascript" src="http://form.jotformpro.com/jsform/32124156488960"></script>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
