import React, { Component, PropTypes } from 'react';
import { FORMTITLE_TRUNCATE } from '../config';
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
    onLoadMore: PropTypes.func.isRequired,
    onRefresh: PropTypes.func
  };

  constructor(props) {
    super(props);
  }

  selectForm(form) {
    this.props.actions.toggleForm(form);
  }

  formaPrimaryText(form) {
    return Utils.truncate(form.title, FORMTITLE_TRUNCATE);
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

  refreshFormList(e) {
    e.stopPropagation();
    e.preventDefault();
    const { onRefresh = false, forms } = this.props;
    if (onRefresh) {
      // offset at 0, to load it from the start
      // and the limit on how many items to pull out
      // based on the current loaded items
      onRefresh(0, forms.items.length);

      // call the loading overlay on the list
      this.refs.list.showLoadingOverlay('Refreshing forms...');
    }
  }

  render() {
    const { forms } = this.props;
    let content = <Loading text="Loading Forms" spinnerName="three-bounce"/>;
    if (!isEmpty(forms.items)) {
      content = (
        <List
          ref="list"
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
              <div className="icon">
                { forms.isFetching && <i className="fa fa-circle-o-notch fa-spin"></i> }
                { !forms.isFetching && <a href='#' className="link" onClick={ (e) => this.refreshFormList(e) }>
                  <Icon
                    name="fa fa-refresh"
                    tip={{
                      content: 'Refresh',
                      placement: 'left'
                    }}
                  />
                </a> }
              </div>
              <div className="icon">
                <i className="fa fa-th-list" aria-hidden="true"></i>
              </div>
            </span>
          </div>
        { content }
      </div>
    );
  }
}

export default FormPicker;
