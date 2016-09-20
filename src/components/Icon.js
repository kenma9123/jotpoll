import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import ToolTip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';

export default class Icon extends Component {

  static propTypes = {
    name: PropTypes.string.isRequired,
    tip: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { name, tip = false } = this.props;
    if (tip) {
      let iconClass = classNames(`fa ${name}`, 'cu-pointer');
      let {content,placement ='left', ...others} = tip;
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
    return <i className={`fa ${name}`} aria-hidden="true"></i>;
  }
}
