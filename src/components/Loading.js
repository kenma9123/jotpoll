import React, { Component, PropTypes } from 'react';
import Spinner from 'react-spinkit';
import '../styles/loading.scss';

class Loading extends Component {

  static propTypes = {
    text: PropTypes.string,
    noFadeIn: PropTypes.bool,
    spinnerName: PropTypes.string
  };

  render() {
    const {
      spinnerName = 'wave',
      text = false,
      noFadeIn = true
    } = this.props;

    return (
      <div className="loading">
        <div className="wrapper">
          <Spinner spinnerName={spinnerName} noFadeIn={noFadeIn}/>
          <div className="text">{text && text}</div>
        </div>
      </div>
    );
  }
}

export default Loading;
