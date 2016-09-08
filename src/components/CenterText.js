import React, { Component, PropTypes } from 'react';
import '../styles/centertext.scss';

class CenterText extends Component {

  static propTypes = {
    text: PropTypes.string.isRequired,
    icon: PropTypes.string
  };

  getIcon() {
    const { icon = false } = this.props;
    return (icon) ?
     <i className={`fa ${icon}`} aria-hidden="true"></i> : '';
  }

  render() {
    const { text } = this.props;
    return (
      <div className="centerText">
        <div className="centerText-wrapper">
          <div className="text">{this.getIcon()} { text }</div>
        </div>
      </div>
    );
  }
}

export default CenterText;
