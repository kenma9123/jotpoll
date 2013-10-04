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
    <script type="text/template" id="poll-navigator-template">
        <div class="section form-division">
            <button id="pickFormWidget" class="btn btn-large btn-block btn-danger">1. Pick a Form</button>
        </div>
        <div class="section form-division">
            <button id="pickQuestionWidget" class="btn btn-large btn-block btn-primary">2. Pick a Question</button>
        </div>
        <div class="section form-division">
            <button id="proceedButton" class="btn btn-large btn-block btn-success" >3. Generate Form URL</button>
        </div>
    </script>

    <script type="text/template" id="poll-results-graph-template-bar">
        <div class="form-division">
            <div id='poll-results'>
                <div id="card">
                    <div class="graph-division" id="options">
                        <ol data-voted="true">
                            <%=graphTitleData%>
                        </ol>
                    </div>
                    <div class="graph-division" id="results">
                        <ol id="chart" class="poll_results_graph">
                            <%=graphData%>
                        </ol>
                    </div>
                    <div class="clear-fix"></div>
                </div>
            </div>
        </div>
    </script>

    <script type="text/template" id="poll-results-graph-template-gauge">
        <div class ="form-divisions">
            <div id='poll-results'>
                <div id="chart-gauge-container">
                    <%=chartPollElement%>
                </div>
            </div>
        </div>
        <div class="form-divisions poll-legends-container">
            <div class="poll-legends-label">
                <i class="icon-eye-open"></i>&nbsp;
                <span class="legend-label">Legend</span>
            </div>
            <div class="poll-legends-inner">
            <%
                $.each(legends, function(index, value){
                    var lName = value.name
                      , lValue = value.value
                      , lHits = (value.hits > 1) ? value.hits + " hits" : ((value.hits === 0) ? 'nothing' : value.hits + " hit")
                      , lColor = value.color;
            %>
                <div class="poll-legends"><div class="legends-box" style="background:<%=lColor%>"></div><div class="legends-text legend<%=(index+1)%>"><%=lName%> - <b><%=lHits %></b> - <b><%=lValue%>%</b></div></div>
            <% }); %>
                <div class="clear-fix"></div>
            </div>
        </div>

        <% if ( _.size(legends) > 0 ) { %>
        <div class="form-divisions poll-legends-container">
            <div class="poll-legends-label">
                <i class="icon-eye-open"></i>&nbsp;
                <span class="legend-label">Information</span>
            </div>
            <div class="poll-legends-inner">
            <%
                var mapped = _.map(legends,function(item){return item['hits'];})
                  , max = _.max(mapped)
                  , iMax = _.indexOf(mapped, max)
                  , min = _.min(mapped)
                  , iMin = _.indexOf(mapped, min)
                  , total = _.reduce( _.pluck(legends, 'hits'), function(x, y){ return x + y; }, 0);
            %>
                <div class="poll-legends"><i class="icon-arrow-up"></i><span class="poll-text"> <b>Highest</b>: <%=legends[iMax].name%> with <%=legends[iMax].hits%> hits</span></div>
                <div class="poll-legends"><i class="icon-arrow-down"></i><span class="poll-text"> <b>Lowest</b>: <%=legends[iMin].name%> with <%=legends[iMin].hits%> hits</span></div>
                <div class="poll-legends"><i class="icon-plus"></i><span><span class="poll-text"> <b>Total casted hits</b>: <%=total%> </span></div>
            </div>
        </div>
        <% } %>
        <div class="clear-fix"></div>
    </script>

    <script type="text/template" id="poll-chart-preview-template">
        <div class="form-division chart-preview">
            <h1 class="form-label">Preview</h1>
            <p style="line-height: 20px;">
                A nifty preview mode where you can see your changes in real time.<br>&nbsp;
            </p>
            <div class="chart-preview-area"></div>
        </div>
    </script>

    <script type="text/tempalte" id="poll-chart-options-template">
        <div class="form-division chart-options">
            <h1 class="form-label">Options</h1>
            <p class="poll-subtitle" style="line-height: 20px;">
                You can customize your own poll style using some of the available options below. Play with it and viola!
            </p>
            <div class="tab-content-options">
                <div class="tab-pane active" id="gaugeChart">
                    <div class="options-divisions">
                        <h4 class="options-title">Individual Bar Settings: <i style="font-size: 15px;"> ( may vary on how many options does your question have )</i></h4>
                        <div class="options-content">
                            <ul class="nav nav-tabs">
                                <%
                                    $.each(poll.bars, function(index,value){
                                        var active_index = 0
                                          , bar_index = (index+1)
                                          , elclass = (active_index===index) ? 'active' : '';
                                %>
                                <li><a class="<%=elclass%>" href="#bar<%=bar_index%>" data-toggle="tab"><%=bar_names[index]%></a></li>
                                <%
                                    });
                                %>
                            </ul>
                            <div class="tab-content hide-elem">
                                <% $.each(poll.bars, function(index,value){
                                    var j = {
                                        barIndex: index + 1,
                                        barColor: poll.bars[index].color,
                                        barBgColor: poll.bars[index].backgroundColor
                                    };
                                %>
                                <div class="tab-pane active" id="bar<%=j.barIndex%>">
                                    <div class="bar-settings-division">
                                        <label class="settings-list bar-label">Color</label>
                                        <input class="settings-list bar-input" data-swatch-position="right" id="<%=element.bars.color + j.barIndex%>" type="text" value="<%=j.barColor%>"/>
                                    </div>
                                    <div class="clear-fix"></div>
                                    <div class="bar-settings-division">
                                        <label class="settings-list bar-label">Background</label>
                                        <input class="settings-list bar-input" id="<%=element.bars.backgroundColor + j.barIndex%>" type="text" value="<%=j.barBgColor%>"/>
                                    </div>
                                </div>
                                <% }); %>
                            </div>
                        </div>
                    </div>
                    <div class="options-divisions">
                        <h4 class="options-title">Common Settings:</h4>
                        <div class="options-content">
                        <div class="common-settings">
                            <label class="common-list-box radio" id="<%=element.chart.gauge.id%>" >
                                <% var isGaugeChecked = (element.chart.gauge.checked === true)?'checked="checked"':'';%>
                                <input type="radio" name="chartType" data-toggle="radio" <%=isGaugeChecked%> value="gauge"> Use Gauge
                            </label>
                        </div>
                       <div class="common-settings">
                            <label class="common-list-box radio" id="<%=element.chart.linear.id%>" >
                                <% var isLinearChecked = (element.chart.linear.checked === true)?'checked="checked"':'';%>
                                <input type="radio" name="chartType" data-toggle="radio" <%=isLinearChecked%> value="linear"> Use Linear
                            </label>
                        </div>
                        <div class="clear-fix"></div>
                            <% $.each(element.common, function(index,value){
                                var e = {
                                    id: value.id,
                                    text: value.text,
                                    checked: (value.checked === true ) ? 'checked="checked"' : '',
                                    invisible: (value.invisible === true) ? 'invisible-elem' : ''
                                };
                            %>
                            <div class="common-settings <%=e.invisible%>">
                                <label class="commons-list"><%=e.text%></label>
                                <span class="settings-list"><input type="checkbox" data-toggle="switch" id="<%=e.id%>" <%=e.checked%>/></span>
                            </div>
                            <% }); %>
                            <div class="clear-fix"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <button id="updatePreview" class="btn btn-small btn-block btn-info">Update Preview</button>
    </script>

    <script type="text/template" id="poll-code-generator-template">
        <div class="form-division code-generator">
            <!--<h1 for="generatedFormData" class="form-label">Form Data Generated</h1>-->
            <span>Copy the generated URL and make it as your Thank you Custom message URL, to view the poll results after a submission.</span>
            <textarea id="generatedFormData" <%=isDisabled%>></textarea>
            <button id="copyToClipboard" class="btn btn-large btn-inverse" <%=isDisabled%>>Copy to Clipboard</button>
            <a href="#" id="visitLinkButton" class="btn btn-large btn-primary" target="_blank" <%=isDisabled%>>Visit Link</a>
        </div>
    </script>


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

    <div class="navbar navbar-inverse navbar-fixed-top" style="position: absolute;">
        <div class="navbar-inner">
          <div class="container">
            <button type="button" class="btn btn-navbar" data-toggle="collapse" data-target="#nav-collapse-01"></button>
            <span class="brand">
                <span class="title-name"><h1><?=JOTPOLL_NAME?></h1></span>&nbsp;<i class="icon-bar-chart"></i></span>
            <div class="nav-collapse collapse" id="nav-collapse-01">
              <ul class="nav">
                <li></li>
                <li class="active"><a href=".">Home</a></li>
                <li ><a href="howto.php">How it Works</a></li>
                <li ><a href="contact.php">Contact Us</a></li>
              </ul>
            </div>
          </div>
        </div>
    </div>

    <div class="container main-content">
        <div class="alert alert-block alert-error hide-elem">
            <button type="button" class="close" data-dismiss="alert">×</button>
            <div class="alert-content">
                <h2 class="alert-heading">Authorization Error!</h2>
                <p>Please login to authorize the Application. Don't have an account yet? Join Us <a href="http://www.jotform.com/" title="JotForm">here</a>.</p>
                <p>
                  <button class="btn btn-mini btn-danger" onclick="window.location.reload();" type="button">Reload Page</button>
                </p>
            </div>
        </div>
        <div class="hero-unit hide-elem">
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
        <div class="hero-unit hide-elem">
            <div id="poll-mainContainer-A" class="poll-result-container">
                <div class="poll-divisions poll-chart-options"></div>
                <div class="poll-divisions poll-chart-preview"></div>
                <div class="clear-fix"></div>
            </div>
        </div>
        <div class="hero-unit invisible-elem">
            <div class="poll-results-graph"></div>
        </div>
    </div>

    <script type="text/javascript" src="<?=HTTP_URL?>scripts/lib/jquery.js"></script>
    <script type="text/javascript" src="<?=HTTP_URL?>scripts/lib/underscore.js"></script>
    <script type="text/javascript" src="<?=HTTP_URL?>scripts/lib/backbone.js"></script>
    <script type="text/javascript" src="<?=HTTP_URL?>scripts/lib/flat/bootstrap.min.js"></script>

    <script type="text/javascript" src="//js.jotform.com/JotForm.js?3.1.{REV}"></script>
    <script type="text/javascript" src="//js.jotform.com/FormPicker.js?3.1.{REV}"></script>
    <script type="text/javascript" src="//js.jotform.com/QuestionPicker.js?3.1.{REV}"></script>

<?php if ( MODE === "live" || MODE === "dev" ) { ?>
    <script type="text/javascript" src="<?=HTTP_URL?>scripts/lib/jstorage.js"></script>
    <script type="text/javascript" src="<?=HTTP_URL?>scripts/lib/jminicolors.js"></script>
    <script type="text/javascript" src="<?=HTTP_URL?>scripts/lib/clipboard/zclip.js"></script>
    <script type="text/javascript" src="<?=HTTP_URL?>scripts/lib/rawdeflate_inflate.js"></script>
    <script type="text/javascript" src="<?=HTTP_URL?>scripts/lib/base64.js"></script>
    <script type="text/javascript" src="<?=HTTP_URL?>scripts/lib/charts/dx.chartjs.js"></script>
    <script type="text/javascript" src="<?=HTTP_URL?>scripts/lib/charts/globalize.js"></script>
    
    <script type="text/javascript" src="<?=HTTP_URL?>scripts/models/pollDataModel.js"></script>
    <script type="text/javascript" src="<?=HTTP_URL?>scripts/models/pollNavigatorModel.js"></script>
    <script type="text/javascript" src="<?=HTTP_URL?>scripts/views/pollNavigatorView.js"></script>
    <script type="text/javascript" src="<?=HTTP_URL?>scripts/models/pollResultsModel.js"></script>
    <script type="text/javascript" src="<?=HTTP_URL?>scripts/views/pollResultsView.js"></script>
    <script type="text/javascript" src="<?=HTTP_URL?>scripts/views/previewChartView.js"></script>
    <script type="text/javascript" src="<?=HTTP_URL?>scripts/views/generateView.js"></script>
    <script type="text/javascript" src="<?=HTTP_URL?>scripts/views/drawChartView.js"></script>
    <script type="text/javascript" src="<?=HTTP_URL?>scripts/models/chartOptionsModel.js"></script>
    <script type="text/javascript" src="<?=HTTP_URL?>scripts/views/chartOptionsView.js"></script>
    <script type="text/javascript" src="<?=HTTP_URL?>scripts/router.js"></script>
    <script type="text/javascript" src="<?=HTTP_URL?>scripts/maincore.js"></script>

    <script type="text/javascript" src="<?=HTTP_URL?>scripts/lib/flat/bootstrap-switch.js"></script>
    <script type="text/javascript" src="<?=HTTP_URL?>scripts/lib/flat/bootstrap-select.js"></script>
    <script type="text/javascript" src="<?=HTTP_URL?>scripts/lib/flat/flatui-checkbox.js"></script>
    <script type="text/javascript" src="<?=HTTP_URL?>scripts/lib/flat/flatui-radio.js"></script>
<?php } else { ?>
    <script type="text/javascript" src="<?=HTTP_URL?>scripts/scripts-min.js"></script>
<?php } ?>
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
</body>
</html>
