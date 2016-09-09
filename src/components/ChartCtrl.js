import React, { Component, PropTypes } from 'react';
import { isEmpty, isEqual, isObject } from 'lodash/lang';
import range from 'lodash/range';

import CopyToClipboard from 'react-copy-to-clipboard';
import Dropdown from './fields/Dropdown';
import ColorPicker from './fields/ColorPicker';

class ChartCtrl extends Component {

  constructor(props) {
    super(props);

    this.state = {
      clipboard: ''
    };
  }

  getInputField(ctrl) {
    // console.log('getInputField', ctrl);
    switch(ctrl.input) {
      case 'dropdown':
       return (
          <Dropdown
            name={ctrl.name}
            disabled={ctrl.disabled || false}
            className="dropdown"
            value={ctrl.default}
            options={ctrl.options.map((option, key) => {
              return {
                ...option,
                key
              };
            })}
            onChange={ctrl.onChange}
          />
        );
      break;
      case 'colorpicker':
        return (
          <div className="input-group table">
            <input type="text" className="table-cell" value={ctrl.value} onChange={(value) => console.log('Input', value)}/>
            <span className="suffix table-cell valign-middle">
              <div className="colorpicker">
                <ColorPicker
                  color={ctrl.value}
                  onChange={ctrl.onChange}
                  onClose={ctrl.onClose}
                  placement="bottomRight"
                />
              </div>
            </span>
          </div>
        );
      break;
      case 'generateview':
        let { text, disabled = false, ...others } = ctrl.button;
        return (
          <div>
            <div className="fields input-button">
              <button type="button" {...others} disabled={disabled}>{ text }</button>
            </div>
            <div className="fields input-group table">
              <input type="text" className="table-cell" value={ctrl.field.value}/>
              <span className="suffix table-cell valign-middle">
                <CopyToClipboard text={ctrl.field.value}
                  onCopy={ctrl.field.onCopy}>
                  <div className="input-icon button-like">
                    <i className="fa fa-clipboard"></i>
                  </div>
                </CopyToClipboard>
              </span>
            </div>
            <div className="fields input-text justify">
              Copy the generated URL and make it as your Thank you Custom message URL. This will show the poll results after a submission.
            </div>
          </div>
        );
      break;
    }
  }

  render() {
    let { ctrls } = this.props;
    const maxItems = 3;

    let index = 0;
    let content = [];
    while (index < ctrls.length) {
      content.push(
        <div className="ctrl-division col span_4_of_12" key={index}>
          { range(maxItems).map((item, i) => {
            const obj = ctrls[index];
            if (obj) {
              index++;
              let { titleIcon, title } = obj;
              return (
                <div className="ctrl-input" key={i}>
                  <label className="ctrl-label">{titleIcon && titleIcon} {title && title}</label>
                  <div className="ctrl-field">
                    { this.getInputField(obj) }
                  </div>
                </div>
              );
            }
          })}
        </div>
      );
    }

    return (
      <div className="ctrl-section col span_12_of_12">
        { content }
      </div>
    );
  }
}

export default ChartCtrl;
