import React, { Component, PropTypes } from 'react';
import { APP_URL } from '../config';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import Color from 'color';
import '../styles/pollchart.scss';

import ChartGenerator from './ChartGenerator';
import { NotificationStack } from 'react-notification';

// import ChartArea from './ChartArea';
import ChartJS from '../utils/ChartJS';
import ChartCtrl from './ChartCtrl';

import CenterText from './CenterText';

class PollChart extends Component {

  constructor(props) {
    super(props);

    this.state = {
      width: 0,
      ctrl: {
        generated: '',
        common: {},
        selected: {}
      },
      notifications: []
    };

    this.handleResize = this.handleResize.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (
      !isEmpty(nextProps.questions.selected) &&
      !isEmpty(nextProps.poll.items) &&
      !isEqual(this.props.poll.items, nextProps.poll.items)
    ) {
      console.log("Not equal", nextProps);
      this.props.actions.generateChart();

      // set default selected props
      if (isEmpty(this.state.ctrl.selected) || !isEqual(this.props.questions.selected, nextProps.questions.selected)) {
        this.setState({
          ctrl: {
            ...this.state.ctrl,
            selected: nextProps.poll.items[0]
          }
        });
      }
    }

    if (!isEqual(this.props.chart.options, nextProps.chart.options)) {
      this.setState({
        ctrl: {
          ...this.state.ctrl,
          common: {
            legend: nextProps.chart.options.legend.display,
            title: nextProps.chart.options.title.display
          }
        }
      });
    }
  }

  componentDidMount() {
    this.setState({
      width: this.getChartContWidth()
    });

    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  addNotification(message, id) {
    let key = id || Date.now();
    let notifications = [...this.state.notifications];
    notifications.push({
      message, key,
      action: '',
      onClick: () => this.removeNotification(key),
    });

    return this.setState({
      notifications
    });
  }

  removeNotification(key) {
    let notif = [...this.state.notifications];
    let notifications = notif.filter(n => n.key !== key);
    this.setState({
      notifications
    });
  }

  notificationDismiss(notification) {
    this.removeNotification(notification.key);
  }

  getChartContWidth() {
    let formpickerWidth = document.getElementById('formpicker');
    let questionpickerWidth = document.getElementById('questionpicker');
    // with 500px min width
    let width = window.innerWidth - formpickerWidth.clientWidth - questionpickerWidth.clientWidth;
    return (width < 700) ? 700 : width;
  }

  handleResize(e) {
    console.log(e);
    this.setState({
      width: this.getChartContWidth()
    });
  }

  getShowHideEquiv(value, reverse = false) {
    if (reverse) {
      return (value === 'show') ? true : false;
    } else {
      return (value) ? 'show' : 'hide';
    }
  }

  generateLink() {
    this.props.onSave();
  }

  getGeneratedValue() {
    const { poll } = this.props;
    let link = !isEmpty(poll.generated) ? `${APP_URL}result/${poll.generated.unique_id}` : '';
    if (!isEmpty(link)) {
      console.log('Link successfully generated.');
    }

    return link;
  }

  generateCtrls() {
    const { poll, chart } = this.props;

    console.log("Common", this.state.ctrl.common);

    let controllers = [{
      title: 'Chart Type',
      name: 'chartType',
      input: 'dropdown',
      disabled: true,
      default: 'horizontalBar',
      options: [{
        text: 'Horizontal Bar',
        value: 'horizontalBar'
      }, {
        text: 'Bar',
        value: 'bar'
      }, {
        text: 'Pie',
        value: 'pie'
      }, {
        text: 'Polar',
        value: 'polar'
      }],
      onChange: (value) => {
        console.log('Chart Type', value);
      }
    }, {
      title: 'Polls',
      name: 'polls',
      input: 'dropdown',
      default: `${this.state.ctrl.selected.key}_${this.state.ctrl.selected.label}`,
      options: poll.items.map((item) => {
        return {
          text: item.label,
          value: `${item.key}_${item.label}`
        };
      }),
      onChange: (el) => {
        let value = el.target.value.split('_');
        let key = Number(value[0]);
        let label = value[1];

        let selected = poll.items.find((item) => {
          if (isEqual(item.key, key) && isEqual(item.label, label)) {
            return item;
          }
        });

        let oldCtrl = this.state.ctrl;
        this.setState({
          ctrl: {
            ...oldCtrl,
            selected
          }
        });
      }
    }, {
      title: 'Background Color',
      name: 'bgcolor',
      input: 'colorpicker',
      value: this.state.ctrl.selected.style.backgroundColor,
      onClose: (color) => {
        this.props.actions.updatePollItem(this.state.ctrl.selected);
      },
      onChange: (color) => {
        let oldCtrl = this.state.ctrl;
        this.setState({
          ctrl: {
            ...oldCtrl,
            selected: {
              ...oldCtrl.selected,
              style: {
                ...oldCtrl.selected.style,
                backgroundColor: color,
                hoverBackgroundColor: Color(color).lighten(0.1).hexString(),
                borderColor: color,
                hoverBorderColor: Color(color).lighten(0.1).hexString()
              }
            }
          }
        });
      }
    }, {
      title: 'Hover Background Color',
      name: 'bgcolor',
      input: 'colorpicker',
      value: this.state.ctrl.selected.style.hoverBackgroundColor,
      onClose: (color) => {
        this.props.actions.updatePollItem(this.state.ctrl.selected);
      },
      onChange: (color) => {
        let oldCtrl = this.state.ctrl;
        this.setState({
          ctrl: {
            ...oldCtrl,
            selected: {
              ...oldCtrl.selected,
              style: {
                ...oldCtrl.selected.style,
                hoverBackgroundColor: color
              }
            }
          }
        });
      }
    }, {
      title: 'Border Color',
      name: 'bgcolor',
      input: 'colorpicker',
      value: this.state.ctrl.selected.style.borderColor,
      onClose: (color) => {
        this.props.actions.updatePollItem(this.state.ctrl.selected);
      },
      onChange: (color) => {
        let oldCtrl = this.state.ctrl;
        this.setState({
          ctrl: {
            ...oldCtrl,
            selected: {
              ...oldCtrl.selected,
              style: {
                ...oldCtrl.selected.style,
                borderColor: color,
                hoverBorderColor: Color(color).lighten(0.1).hexString()
              }
            }
          }
        });
      }
    }, {
      title: 'Hover Border Color',
      name: 'bgcolor',
      input: 'colorpicker',
      value: this.state.ctrl.selected.style.hoverBorderColor,
      onClose: (color) => {
        this.props.actions.updatePollItem(this.state.ctrl.selected);
      },
      onChange: (color) => {
        let oldCtrl = this.state.ctrl;
        this.setState({
          ctrl: {
            ...oldCtrl,
            selected: {
              ...oldCtrl.selected,
              style: {
                ...oldCtrl.selected.style,
                hoverBorderColor: color
              }
            }
          }
        });
      }
    }, {
      title: 'Generate URL',
      titleIcon: <i className="fa fa-gear"></i>,
      input: 'generateview',
      field: {
        value: this.getGeneratedValue(),
        onCopy: () => this.addNotification('Link has been copied to clipboard.')
      },
      button: {
        disabled: poll.isSaving,
        text: (poll.isSaving) ? 'Please wait...' : 'Generate',
        onClick: () => this.generateLink()
      }
    }];

    return controllers;
  }

  getDefaultStatusText() {
    const { forms, questions } = this.props;
    let ctext = "Select ";
    if (isEmpty(forms.selected)) {
      ctext += "a form and ";
    }

    if (isEmpty(questions.selected)) {
      ctext += "a question";
    }

    ctext += " to render preview chart."

    return (
      <CenterText text={ctext} icon="fa-info-circle"/>
    );
  }

  render() {
    const { questions, chart } = this.props;

    let content = this.getDefaultStatusText();
    console.log("Render pollchart");
    if (chart.ready) {

      let { options, data } = chart;console.log("OPTIONS !!!!", data, options);
      let type = chart.type;
      if (['polarArea', 'pie', 'doughnut'].indexOf(type) > -1) {
        options = {};
      }

      // only allow 20 items on the chart
      if (data.labels.length > 20) {
        const text = `It appears that you selected a question with ${data.labels.length} options.\nJotPoll only support up to 20 options per question.`;
        content = <CenterText text={text} icon="fa-warning" />;
      } else {
        content = (
          <div className="chart-area">
            <div className="chart-division">
              <div className="chart-preview">
                <h2>Chart Preview</h2>
                <ChartJS
                  ref="chart"
                  data={data}
                  options={options}
                  type={type}
                />
              </div>
              <div className="chart-control">
                <h2>Chart Control - {questions.selected.text}</h2>
                <ChartCtrl
                  ref="chartCtrl"
                  ctrls={this.generateCtrls()}
                />
              </div>
            </div>
          </div>
        );
      }
    }

    return (
      <div className="division pollchart-cont" style={{width: this.state.width}}>
        <div className="section-title center-text">
          Poll Chart
          <span className="icon-container">
            <i className="fa fa-pie-chart"></i>
          </span>
        </div>
        <div className="container chart-holder">
          { content }
        </div>
        <NotificationStack
          dismissAfter={3000}
          action={false}
          notifications={this.state.notifications}
          onDismiss={(notification) => this.notificationDismiss(notification)}
        />
      </div>
    );
  }
}

export default PollChart;
