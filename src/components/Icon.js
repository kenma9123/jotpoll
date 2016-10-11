import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import ToolTip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';

export default class Icon extends Component {

  static propTypes = {
    name: PropTypes.string.isRequired,
    tip: PropTypes.object,
    spin: PropTypes.bool
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { name, tip = false, spin = false } = this.props;
    const iconClass = classNames(`fa ${name}`, {
      'cu-pointer': !!tip,
      'fa-spin': spin
    });
    
    if (tip && Object.keys(tip).length > 0) {
      const { content, placement ='left', ...others } = tip;
      return (
        <ToolTip
          overlay={content}
          placement={placement}
          {...others}
        >
          <i className={iconClass} aria-hidden="true"></i>
        </ToolTip>
      );
    }
    return <i className={iconClass} aria-hidden="true"></i>;
  }
}
