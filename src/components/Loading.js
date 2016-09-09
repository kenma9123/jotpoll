import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Spinner from 'react-spinkit';
import '../styles/loading.scss';

class Loading extends Component {

  static propTypes = {
    text: PropTypes.string,
    noFadeIn: PropTypes.bool,
    spinnerName: PropTypes.string,
    before: PropTypes.element,
    className: PropTypes.string
  };

  render() {
    const {
      spinnerName = 'wave',
      text = false,
      noFadeIn = true,
      before = false,
      className = false
    } = this.props;

    let loading = classNames('loading', className);

    return (
      <div className={ loading }>
        <div className="wrapper">
          { before && before }
          <Spinner spinnerName={spinnerName} noFadeIn={noFadeIn}/>
          <div className="text">{text && text}</div>
        </div>
      </div>
    );
  }
}

export default Loading;
