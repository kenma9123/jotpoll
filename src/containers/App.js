import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ActionCreators from '../actions';
import { routeActions } from 'react-router-redux';

class App extends Component {

  componentDidMount() {
    // console.log('Router', this.props.routing);
  }

  componentWillReceiveProps(nextProps) {
    // console.log('Next Router', nextProps.routing);
  }

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

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, ActionCreators, routeActions), dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

