import React, { Component, PropTypes } from 'react';

class App extends Component {

  render() {
    // put props to its childrend
    var childrenWithProps = React.Children.map(this.props.children, (child) => {
        return React.cloneElement(child, {...this.props});
    });

    return (
      <div>
        { childrenWithProps }
      </div>
    );
  }
}

export default App;
