import React, { Component } from 'react';
import '../styles/logo.scss';

class Logo extends Component {

  render() {
    return (
      <div className="logo-block">
        <img src="assets/logo-solid.png" />
        <div className="title">JotPoll</div>
      </div>
    );
  }
}

export default Logo;
