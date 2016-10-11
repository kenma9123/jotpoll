import React, { Component, PropTypes } from 'react';
import Icon from './Icon';
import InputBox from './InputBox';

class SectionTitle extends Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
    rightIcons: PropTypes.array
  };

  constructor(props) {
    super(props);
  }

  getLinkComponent(component, onClick = () => {}) {
    return (
      <a href='#' className="link" onClick={ onClick }>
        { component }
      </a>
    );
  }

  render() {

    const { title, rightIcons = false } = this.props;

    let content = (
      <div className="title-content">
        { title }
        <span className="icon-container right">
          { rightIcons && rightIcons.map((right, key) => {

            const { onClick = false, icon, spin = false, showOn = true, tip = {} } = right;

            if (showOn) {
              let iconComponent = (
                <Icon
                  name={ icon }
                  tip={ tip }
                  spin={ spin }
                />
              );

              // if theres a click, wrap it with <a/> tag
              if (onClick) {
                iconComponent = this.getLinkComponent(iconComponent, onClick);
              }

              return (
                <div className="icon" key={key}>
                  { iconComponent }
                </div>
              );
            }
          }) }
        </span>
      </div>
    );

    return (
      <div className="section-title">
        { content }
      </div>
    );
  }
}

export default SectionTitle;
