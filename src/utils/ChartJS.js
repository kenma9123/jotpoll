import React, { Component, PropTypes } from 'react';
import Chart from 'chart.js';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';

class ChartJS extends Component {

  static propTypes = {
    data: PropTypes.object.isRequired,
    options: PropTypes.object,
    type: PropTypes.oneOf([
      'doughnut', 'pie', 'line',
      'bar', 'radar', 'polarArea',
      'bubble', 'horizontalBar'
    ]).isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      chart: {}
    };
  }

  componentDidMount() {
    this.initializeChart(this.props);
  }

  componentWillReceiveProps(nextProps) {
    console.log('Canvas receive this.props.', this.props, nextProps);
    // this.destroyChart();
    // this.initializeChart(nextProps);
    if (!isEmpty(this.state.chart)) {
      // console.log('this chart', this.state.chart);
      this.state.chart.data.labels = nextProps.data.labels;
      this.state.chart.data.datasets = nextProps.data.datasets;
      this.state.chart.update();
    } else {
      this.destroyChart();
      this.initializeChart(nextProps);
    }

    // if options are updater, redraw chart
    if (!isEqual(this.props.options, nextProps.options) ||
      !isEqual(this.props.type, nextProps.type)
    ) {
      this.destroyChart();
      this.initializeChart(nextProps);
    }
  }

  componentWillUnmount() {
    this.destroyChart();
  }

  getChart() {
    return this.state.chart;
  }

  destroyChart() {
    this.state.chart && this.state.chart.destroy();
  }

  initializeChart(props) {
    const {data, options, type} = props;
    const ctx = this.refs.canvas.getContext('2d');
    this.setState({
      chart: new Chart(ctx, {
        type: type,
        data: data,
        options: options
      })
    });
  }

  render() {
    const { data, options, type, ...others } = this.props;

    return <canvas ref="canvas" {...others} />
  };
}

export default ChartJS;
