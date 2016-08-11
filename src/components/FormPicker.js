import React, { Component, PropTypes } from 'react';
import { isEmpty } from 'lodash/lang';
import '../styles/formpicker.scss';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ActionCreators from '../actions';
import { routeActions } from 'react-router-redux';

import List from './List';

class FormPicker extends Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
    forms: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  componentWillMount() {
    // load form list if empty
    const { actions, forms, user } = this.props;
    if (isEmpty(forms.items)) {
      actions.fetchAndFilterForms(user.apikey);
    }
  }

  selectForm(form) {
    this.props.actions.toggleForm(form);
  }

  render() {
    const { forms } = this.props;
    let content = <div>Loading forms...</div>;
    if (!isEmpty(forms.items)) {
      content = (
        <List
          name="formpicker"
          items={forms.items}
          primaryProp={'title'}
          secondaryProp={'updated_at'}
          selected={forms.selected}
          onItemSelect={(item) => this.selectForm(item)}
        />
      );
    }

    return (
      <div className="division formpicker-cont">
          <div className="section-title">
            Widget List
            <span className="icon-container">
              <i className="fa fa-th-list"></i>
            </span>
          </div>
        { content }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    forms: state.forms,
    user: state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, ActionCreators, routeActions), dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormPicker);
