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

    $scripts =
    '
    <script type="text/javascript" src="' . HTTP_URL . 'scripts/lib/jquery.js"></script>
    <script type="text/javascript" src="' . HTTP_URL . 'scripts/lib/underscore.js"></script>
    <script type="text/javascript" src="' . HTTP_URL . 'scripts/lib/backbone.js"></script>
    <script type="text/javascript" src="' . HTTP_URL . 'scripts/lib/flat/bootstrap.min.js"></script>
    <script type="text/javascript" src="' . HTTP_URL . 'scripts/lib/tools.js"></script>

    <script type="text/javascript" src="//js.jotform.com/JotForm.js?3.1.{REV}"></script>
    <script type="text/javascript" src="//js.jotform.com/FormPicker.js?3.1.{REV}"></script>
    <script type="text/javascript" src="//js.jotform.com/QuestionPicker.js?3.1.{REV}"></script>

    <script type="text/javascript" src="' . HTTP_URL . 'scripts/lib/jstorage.js"></script>
    <script type="text/javascript" src="' . HTTP_URL . 'scripts/lib/jminicolors.js"></script>
    <script type="text/javascript" src="' . HTTP_URL . 'scripts/lib/clipboard/zclip.js"></script>
    <script type="text/javascript" src="' . HTTP_URL . 'scripts/lib/rawdeflate_inflate.js"></script>
    <script type="text/javascript" src="' . HTTP_URL . 'scripts/lib/base64.js"></script>
    <script type="text/javascript" src="' . HTTP_URL . 'scripts/lib/charts/dx.chartjs.js"></script>
    <script type="text/javascript" src="' . HTTP_URL . 'scripts/lib/charts/globalize.js"></script>
    
    <script type="text/javascript" src="' . HTTP_URL . 'scripts/models/account-model.js"></script>
    <script type="text/javascript" src="' . HTTP_URL . 'scripts/views/account-view.js"></script>
    <script type="text/javascript" src="' . HTTP_URL . 'scripts/models/pollDataModel.js"></script>
    <script type="text/javascript" src="' . HTTP_URL . 'scripts/models/pollNavigatorModel.js"></script>
    <script type="text/javascript" src="' . HTTP_URL . 'scripts/views/pollNavigatorView.js"></script>
    <script type="text/javascript" src="' . HTTP_URL . 'scripts/models/pollResultsModel.js"></script>
    <script type="text/javascript" src="' . HTTP_URL . 'scripts/views/pollResultsView.js"></script>
    <script type="text/javascript" src="' . HTTP_URL . 'scripts/views/previewChartView.js"></script>
    <script type="text/javascript" src="' . HTTP_URL . 'scripts/views/generateView.js"></script>
    <script type="text/javascript" src="' . HTTP_URL . 'scripts/views/drawChartView.js"></script>
    <script type="text/javascript" src="' . HTTP_URL . 'scripts/models/chartOptionsModel.js"></script>
    <script type="text/javascript" src="' . HTTP_URL . 'scripts/views/chartOptionsView.js"></script>
    <script type="text/javascript" src="' . HTTP_URL . 'scripts/router.js"></script>
    <script type="text/javascript" src="' . HTTP_URL . 'scripts/maincore.js"></script>

    <script type="text/javascript" src="' . HTTP_URL . 'scripts/lib/flat/bootstrap-switch.js"></script>
    <script type="text/javascript" src="' . HTTP_URL . 'scripts/lib/flat/bootstrap-select.js"></script>
    <script type="text/javascript" src="' . HTTP_URL . 'scripts/lib/flat/flatui-checkbox.js"></script>
    <script type="text/javascript" src="' . HTTP_URL . 'scripts/lib/flat/flatui-radio.js"></script>
    ';

    define("PAGE_HEAD", $header);
    define("PAGE_STYLES", $styles);
    define("PAGE_SCRIPTS", $scripts);
    define("PAGE_TITLE", "JotPoll");
    define("JOTPOLL_NAME", "JotPoll");

?>