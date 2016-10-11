import React, { Component, PropTypes } from 'react';

class InputBox extends Component {

  static propTypes = {
    autoFocus: PropTypes.bool
  };

  componentDidMount() {
    this.inputBox.focus();
  }

  getValue() {
    return this.inputBox.value;
  }

  render() {
    return (
      <input
        ref={(input) => this.inputBox = input}
        type="text"
        {...this.props}
      />
    );
  }
}

export default InputBox;
