<?php
    
    require_once(__DIR__ . "/init.php");
    
    $header = '
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="keywords" content="jotpoll, jotform poll, poll view, online poll, web poll, online polls, web polls, view poll, view polls" />
        <meta name="description" content="JotPoll, view amazing polls after a form submission with JotForm" />
        <meta name="google-site-verification" content="CG6F2CQMNJ3nvu1pdPuN7Ww_YcG1-0cMc06ntbB12wk" />
        <meta property="og:title" content="JotPoll" />
        <meta property="og:description" content="JotPoll, view amazing polls after a form submission with JotForm" />
        <meta property="og:image" content="http://cms.interlogy.com/uploads/image_upload/image_upload/global/9260_150X150.jpg" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="http://www.jotpoll.com" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="http://www.jotpoll.com" />
        <meta name="twitter:title" content="JotPoll" />
        <meta name="twitter:description" content="JotPoll, view amazing polls after a form submission with JotForm" />
        <meta name="twitter:image" content="http://cms.interlogy.com/uploads/image_upload/image_upload/global/9260_150X150.jpg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <meta name="HandheldFriendly" content="true" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <base href="' . HTTP_URL . '" />
    ';

    $styles = '
        <link rel="Shortcut Icon" href="' . HTTP_URL . 'css/images/favicon.ico" />
        <!-- <link rel="stylesheet" href="' . HTTP_URL . 'css/normal.css" type="text/css" media="screen, projection" /> -->
        <link rel="stylesheet" href="' . HTTP_URL . 'css/font/stylesheet.css" type="text/css" media="screen, projection" />
        <link rel="stylesheet" href="' . HTTP_URL . 'css/jminicolors.css">
        <link rel="stylesheet" href="' . HTTP_URL . 'css/bootstrap.css" type="text/css" media="screen, projection" />
        <!-- <link rel="stylesheet" href="' . HTTP_URL . 'css/bootstrap-responsive.css" type="text/css" media="screen, projection" /> -->
        <link rel="stylesheet" href="' . HTTP_URL . 'css/flat-ui.css" type="text/css" media="screen, projection" />
        <link rel="stylesheet" href="' . HTTP_URL . 'css/poll.css" type="text/css" media="screen, projection" />
        <link rel="stylesheet" href="' . HTTP_URL . 'css/common-page-styles.css" type="text/css" media="screen, projection" />
        <link rel="stylesheet" href="' . HTTP_URL . 'css/font-awesome.css">
        <!--[if IE 7]><link rel="stylesheet" href="' . HTTP_URL . 'css/font-awesome-ie7.css"><![endif]-->
    ';

    define("PAGE_HEAD", $header);
    define("PAGE_STYLES", $styles);
    define("PAGE_TITLE", "JotPoll");
    define("JOTPOLL_NAME", "JotPoll");

?>