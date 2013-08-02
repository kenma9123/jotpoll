<?php
    require_once("lib/init.php");
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
            <!-- <h1 for="formsList" class="form-label">Form List</h1>
            <select id="formsList" class="selectpicker">
                <%=formsOptions%>
            </select>-->
            <button id="pickFormWidget" class="btn btn-large btn-block btn-danger">Pick a Form</button>
        </div>
        <div class="section form-division">
            <h1 for="questionList" class="form-label">Question List</h1>
            <select id="questionList" class="selectpicker">
                <%=questionOptions%>
            </select>
        </div>
        <div class="section form-division">
            <button id="proceedButton" class="btn btn-large btn-block btn-success" >Generate Form URL</button>
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
                    <%=chartGaugeElement%>
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
                      , lColor = value.color;
            %>
                <div class="poll-legends"><div class="legends-box" style="background:<%=lColor%>"></div><div class="legends-text legend<%=(index+1)%>"><%=lName%> - <b><%=lValue%>%</b></div></div>
            <% }); %>
                <div class="clear-fix"></div>
            </div>
        </div>
    </script>

    <script type="text/template" id="poll-chart-preview-template">
        <div class="form-division chart-preview">
            <h1 class="form-label">Preview</h1>
            <div class="chart-preview-area"></div>
        </div>
    </script>

    <script type="text/template" id="poll-chart-options-gaugeTab-template">
        <div class="tab-pane active" id="bar<%=barIndex%>">
            <div class="bar-settings-division">
                <label class="settings-list bar-label">Color</label>
                <input class="settings-list bar-input" id="<%=colorElement + barIndex%>" type="text" value="<%=barColor%>"/>
            </div>
            <div class="clear-fix"></div>
            <div class="bar-settings-division">
                <label class="settings-list bar-label">Background</label>
                <input class="settings-list bar-input" id="<%=bgcolorElement + barIndex%>" type="text" value="<%=barBgColor%>"/>
            </div>
        </div>
    </script>

    <script type="text/tempalte" id="poll-chart-options-template">
        <div class="form-division chart-options">
            <h1 class="form-label">Options</h1>
            <ul class="nav nav-tabs">
                <li class="active"><a href="#gaugeChart" data-toggle="tab">Gauge</a></li>
            </ul>
            <div class="tab-content">
                <div class="tab-pane active" id="gaugeChart">
                    <div class="options-divisions">
                        <h4 class="options-title">Individual Bar Settings:</h4>
                        <div class="options-content">
                            <ul class="nav nav-tabs">
                              <li><a href="#bar1" data-toggle="tab">Bar A</a></li>
                              <li><a href="#bar2" data-toggle="tab">Bar B</a></li>
                              <li><a href="#bar3" data-toggle="tab">Bar C</a></li>
                              <li><a href="#bar4" data-toggle="tab">Bar D</a></li>
                              <li class="active"><a href="#bar5" data-toggle="tab">Bar E</a></li>
                            </ul>
                            <div class="tab-content hide-elem">
                                <% $.each(gauge.bars, function(index,value){
                                    var j = {
                                        barIndex: index + 1,
                                        barColor: gauge.bars[index].color,
                                        barBgColor: gauge.bars[index].backgroundColor
                                    };
                                %>
                                <div class="tab-pane active" id="bar<%=j.barIndex%>">
                                    <div class="bar-settings-division">
                                        <label class="settings-list bar-label">Color</label>
                                        <input class="settings-list bar-input" id="<%=element.bars.color + j.barIndex%>" type="text" value="<%=j.barColor%>"/>
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
                            <% $.each(element.common, function(index,value){
                                var e = {
                                    id: value.id,
                                    text: value.text,
                                    checked: value.checked
                                };
                            %>
                            <div class="common-settings">
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
        <button id="updatePreview" class="btn btn-small btn-block btn-info" style="width: 50%;">Update Preview</button>
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

    <div class="navbar navbar-inverse navbar-fixed-top">
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

    <div class="container">
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
                    <h1 class="content-header-name">Poll</h1><p class="poll-subtitle">Configure your poll look and feel. You can easily customize it by just playing some of the options given.</p>
                </div>
            </div>
            <div id="poll-mainContainer-A" class="poll-result-container">
                <div class="poll-divisions poll-chart-options"></div>
                <div class="poll-divisions poll-chart-preview"></div>
                <div class="clear-fix"></div>
            </div>
        </div>
        <div class="hero-unit hide-elem">
            <div class="poll-panel" style="border-bottom: 1px solid #BBB;padding: 0px;">
                <div class="poll-panel-inner">
                    <h1 class="content-header-name">Form Details</h1><p class="poll-subtitle">Where all the data is coming from. Pick a form, pick a question and click the button to generate a URL you can visit.</p>
                </div>
            </div>
            <div id="poll-mainContainer-B" class="poll-result-container">
                <div class="poll-divisions poll-navigator"></div>
                <div class="poll-divisions poll-code-generator"></div>
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

    <script type="text/javascript" src="//js.jotform.com/JotForm.js"></script>
    <script type="text/javascript" src="//js.jotform.com/JotFormAPIWidgets.js"></script>
    <script type="text/javascript" src="<?=HTTP_URL?>scripts/lib/clipboard/zclip.js"></script>
    <script type="text/javascript" src="<?=HTTP_URL?>scripts/lib/rawdeflate_inflate.js"></script>
    <script type="text/javascript" src="<?=HTTP_URL?>scripts/lib/base64.js"></script>
    <script type="text/javascript" src="<?=HTTP_URL?>scripts/lib/charts/dx.chartjs.js"></script>
    <script type="text/javascript" src="<?=HTTP_URL?>scripts/lib/charts/globalize.js"></script>

    <script type="text/javascript" src="<?=HTTP_URL?>scripts/lib/flat/bootstrap.min.js"></script>
    <script type="text/javascript" src="<?=HTTP_URL?>scripts/lib/flat/bootstrap-switch.js"></script>
    <script type="text/javascript" src="<?=HTTP_URL?>scripts/lib/flat/bootstrap-select.js"></script>
    <script type="text/javascript" src="<?=HTTP_URL?>scripts/lib/flat/flatui-checkbox.js"></script>
    <script type="text/javascript" src="<?=HTTP_URL?>scripts/lib/flat/flatui-radio.js"></script>
    <script type="text/javascript" src="<?=HTTP_URL?>scripts/lib/flat/jquery.placeholder.js"></script>

    <?php if ( MODE !== "live" ) { ?>
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
    <?php } else { ?>
<script type="text/javascript" src="<?=HTTP_URL?>scripts/scripts-min.js"></script>
    <?php } ?>
</body>
</html>
