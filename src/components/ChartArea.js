import React, { Component, PropTypes } from 'react';
import ChartJS from '../utils/ChartJS';

import ChartCtrl from './ChartCtrl';

class ChartArea extends Component {

  static propTypes = {
    type: PropTypes.string.isRequired,
    question: PropTypes.object.isRequired,
    chartData: PropTypes.object.isRequired,
    chartOptions: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      chartReady: false
    };
  }

  componentDidMount() {
    this.setState({chartReady: true});
  }

  getInstance() {
    return this.refs.chart.getChart();
  }

  render() {
    let content = 'Loading chart...';
    if (this.state.chartReady) {
      let { type, chartData, chartOptions, question, ...others } = this.props;
      if (['polarArea', 'pie', 'doughnut'].indexOf(type) > -1) {
        chartOptions = {};
      }

      content = (
        <div>
          <div className="chart-division">
            <div className="chart-preview">
              <h2>Chart Preview</h2>
              <ChartJS
                ref="chart"
                data={chartData}
                options={chartOptions}
                type={type} {...others}
              />
            </div>
            <div className="chart-control">
              <h2>Chart Control - {question.text}</h2>
              <ChartCtrl
                ref="chartCtrl"
                data={chartData}
                options={chartOptions}
                type={type}
              />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="chart-area">
        { content }
      </div>
    );
  }
}

export default ChartArea;
