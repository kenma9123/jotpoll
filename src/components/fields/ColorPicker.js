import React, { Component, PropTypes } from 'react';
import ColorsPicker  from 'react-colors-picker';
import 'react-colors-picker/assets/index.css';

class ColorPicker extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedColor: ''
    };
  }

  onChange(value) {
    let selectedColor = value.color;
    this.setState({
      selectedColor
    }, () => {
      let { onChange = false } = this.props;
      onChange(selectedColor);
    });
  }

  onClose() {
    let { onClose = false } = this.props;
    if (onClose) {
      onClose(this.state.selectedColor);
    }
  }

  render() {
    let { onClose, onChange, ...others } = this.props;
    return (
      <ColorsPicker
        {...others}
        onChange={ (value) =>this.onChange(value) }
        onClose={ () => this.onClose() }
      />
    );
  }
}

export default ColorPicker;
