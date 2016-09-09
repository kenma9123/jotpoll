import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

class Dropdown extends Component {

  static propTypes = {
    name: PropTypes.string,
    className: PropTypes.string.isRequired, // class added to <select>
    options: PropTypes.array,
    size: PropTypes.string,
    onChange: PropTypes.func, // on select change
    defaultValue: PropTypes.string,
    disabled: PropTypes.bool,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array
    ]),
    multiple: PropTypes.bool
  };

  static defaultProps = {
    className: 'dropdown'
  };

  constructor(props) {
    super(props);
  }

  renderGroup(name, items, index) {
    let options = items.map((item, j) => {
      return this.renderOption(item.key, item.text, item.value, false, j);
    });
    return (
      <optgroup key={index} label={ name }>
        { options }
      </optgroup>
    );
  }

  renderOption(key, text, value, disabled, index) {
    let tempOption;
    let tempValue = key;
    // look inside the option if "value" exists
    if ( value !== undefined && value !== null ) {
      tempValue = value;
    }
    if(disabled) {
      tempOption = (<option disabled
        key={ [key, index].join('_') }
        value={ tempValue }
      >
        { text || value}
      </option>);
    } else {
      tempOption = (<option
        key={ [key, index].join('_') }
        value={ tempValue }
      >
        { text || value}
      </option>);
    }
    return tempOption;
  }

  render() {
    let cx = classNames({
      'dropdownWrapper': true,
      'disabled': this.props.disabled,
      ['u-' + this.props.size]: this.props.size,
      'u-multiple': this.props.multiple,
    });

    let { options, ...otherprops } = this.props;

    options = options.map((option, i) => {
      if(typeof option.type !== 'undefined' && option.type === 'group') {
        return this.renderGroup(option.name, option.options, i);
      }
      let disabled = option.disabled || false;
      return this.renderOption(option.key, option.text, option.value, disabled, i);
    });

    return (
      <div className={ cx } >
        <select { ...otherprops }>
          { options }
        </select>
        <span className="dropdownMask"></span>
      </div>
    );
  }
}

export default Dropdown;
