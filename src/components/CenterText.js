import React, { Component, PropTypes } from 'react';
import isEqual from 'lodash/isEqual';
import '../styles/centertext.scss';

class CenterText extends Component {

  static propTypes = {
    text: PropTypes.string.isRequired,
    icon: PropTypes.element,
    iconPosition: PropTypes.string
  };

  getIcon() {
    const { icon = false } = this.props;
    return (icon) ? icon : '';
  }

  isIconPosition(pos) {
    const { iconPosition = 'left' } = this.props;
    return isEqual(pos, iconPosition);
  }

  render() {
    const { text, iconPosition = 'left' } = this.props;
    return (
      <div className="centerText">
        <div className="centerText-wrapper">
          <div className="text">
            {this.isIconPosition('left') && this.getIcon()}
            <span> { text }</span>
            {this.isIconPosition('right') && this.getIcon()}
          </div>
        </div>
      </div>
    );
  }
}

export default CenterText;
