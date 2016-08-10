import React, { Component, PropTypes } from 'react';

export default class Container extends Component {

  componentDidMount() {
    this.childrenWithProps = React.Children.map(this.props.children, (child) => {
        return React.cloneElement(child, {...this.props});
    });
  }

  render() {
    console.log(this.props);
    // put props to its childrend


    return (
      <div className={ this.props.route.path.substr(1) }>
        { this.childrenWithProps }
      </div>
    );
  }
}
