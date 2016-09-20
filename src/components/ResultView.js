import React, { Component, PropTypes } from 'react';
import '../styles/animate.css';
import '../styles/result.scss';
import isEmpty from 'lodash/isEmpty';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ActionCreators from '../actions';
import { routeActions } from 'react-router-redux';

import { Scrollbars } from 'react-custom-scrollbars';
import ChartJS from '../utils/ChartJS';
import Loading from './Loading';

class ResultView extends Component {

  static propTypes = {
    id: PropTypes.string.isRequired,
    result: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      resultReady: false
    };
  }

  componentWillMount() {
    // render result view if result id prop is empty
    if (isEmpty(this.props.result.id)) {
      this.props.actions.loadResults(this.props.id);
    }

    // put names to body
    document.getElementsByTagName('body')[0].className = 'result-view';
  }

  componentWillReceiveProps(nextProps) {
    if (!isEmpty(nextProps.result.poll)) {
      this.resulDataLoaded();
    }

    if (!isEmpty(nextProps.poll.items) && !nextProps.chart.ready) {
      this.props.actions.generateChart();
    }
  }

  resulDataLoaded() {
    this.setState({
      resultReady: true
    });
  }

  render() {

    let mainContent = <Loading spinnerName="rotating-plane" text="Loading Poll results" noFadeIn={false}/>;

    let { data, options, type } = this.props.chart;
    let { items } = this.props.poll;

    if (this.state.resultReady) {
      mainContent = (
        <div className="fadeIn animated">
          <div className="header division">
            <div className="heading">Poll result</div>
            <div className="sub-heading">{this.props.result.poll.name}</div>
          </div>
          <div className="chart division">
            <ChartJS
              ref="chart"
              data={data}
              options={options}
              type={type}
            />
          </div>
          <div className="table division">
            <table className="table-poll">
              <tbody>
                <tr>
                  <th className="item-color">&nbsp;</th>
                  <th className="item-label">Options</th>
                  <th className="item-value">Percentage (%)</th>
                  <th className="item-count">Total</th>
                </tr>
                { items && items.map((item, key) => {
                  return (
                    <tr key={key}>
                      <td className="item-color" style={{color: item.style.backgroundColor}}><i className="fa fa-circle"></i></td>
                      <td className="item-label">{item.label}</td>
                      <td className="item-value">{item.value}%</td>
                      <td className="item-count">{item.count}</td>
                    </tr>
                  );
                }) }
              </tbody>
            </table>
          </div>
          <div className="footer division">
            <a href="https://www.jotform.com/">
              <img id="footer-logo" width="130" src="https://cdn.jotfor.ms//images/logo@4x.png?v3"/>
            </a>
          </div>
        </div>
      );
    }

    return (
      <div id="page-wrap">
        <div id="pollContainer">
          {mainContent}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    result: state.result,
    chart: state.chart,
    poll: state.poll
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...ActionCreators,
      ...routeActions
    }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResultView);
