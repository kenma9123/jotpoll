import React, { Component, PropTypes } from 'react';

class ListItem extends Component {

  render() {
    const { children, ...others } = this.props;
    return (
      <li {...others}>
        { children }
      </li>
    );
  }
}

export default ListItem;
