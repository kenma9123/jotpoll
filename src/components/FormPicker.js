import React, { Component, PropTypes } from 'react';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import * as Utils from '../utils';
import '../styles/formpicker.scss';

import List from './List';
import Loading from './Loading';
import Icon from './Icon';

class FormPicker extends Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
    forms: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    onLoadMore: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
  }

  selectForm(form) {
    this.props.actions.toggleForm(form);
  }

  formaPrimaryText(form) {
    return Utils.truncate(form.title, 40);
  }

  formatSecondaryText(form) {
    let date = moment(form.updated_at).format("MMM Do YYYY");
    return (
      <div>
        {form.count} <i>Submissions</i>; {form.new} <i>New</i><br/>
        Last update: {date}
      </div>
    );
  }

  externalClick(e) {
    e.stopPropagation();
  }

  setRightIcon(form) {
    const content = 'Preview';
    return (
      <a href={form.url} onClick={this.externalClick} target="_blank" >
        <Icon
          name="fa-external-link-square"
          tip={{
            content,
            placement: 'top'
          }}
        />
      </a>
    );
  }

  render() {
    const { forms } = this.props;
    let content = <Loading text="Loading Forms" spinnerName="three-bounce"/>;
    if (!isEmpty(forms.items)) {
      content = (
        <List
          name="formpicker"
          items={forms.items}
          selected={forms.selected}
          primaryProp={(form) => this.formaPrimaryText(form)}
          secondaryProp={(form) => this.formatSecondaryText(form)}
          onItemSelect={(form) => this.selectForm(form)}
          rightIcon={(form) => this.setRightIcon(form)}
          infiniteScroll={{
            start: 1,
            isFetching: forms.isFetching,
            onLoadMore: this.props.onLoadMore,
            loadingText: 'Loading forms...'
          }}
        />
      );
    }

    return (
      <div className="division formpicker-cont" id="formpicker">
          <div className="section-title">
            Form List
            <span className="icon-container right">
              <i className="fa fa-th-list"></i>
            </span>
          </div>
        { content }
      </div>
    );
  }
}

export default FormPicker;
