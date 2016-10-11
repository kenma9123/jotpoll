import React, { Component, PropTypes } from 'react';
import { FORMTITLE_TRUNCATE } from '../config';
import isEmpty from 'lodash/isEmpty';
import _unescape from 'lodash/unescape';
import moment from 'moment';
import * as Utils from '../utils';
import '../styles/formpicker.scss';

import SectionTitle from './SectionTitle';
import SearchBar from './SearchBar';
import List from './List';
import CenterText from './CenterText';
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

    this.state = {
      search: false,
      searchKeyword: '',
      allowScroll: true
    };
  }

  selectForm(form) {
    if (this.state.search) {
      // console.log("search update");
      this.setState({
        search: false
      }, () => {
        // scroll to selected form
        var offset = document.getElementById(form.id).offsetTop;
        // console.log(offset);
        // console.log(this.refs.list.getScrollBar());
        // console.log(this.refs.list.getScrollBarScrollHeight());
        // console.log(this.refs.list.getScrollHeight());
        // console.log(this.refs.list.getScrollBarScrollerHeight());
        this.refs.list.setScrollBarToOffset(offset);
        setTimeout(() => {
          this.setState({
            allowScroll: true
          });
        }, 500);
      });
    }

    this.props.actions.toggleForm(form);
  }

  formatPrimaryText(form) {
    return _unescape(Utils.truncate(form.title, FORMTITLE_TRUNCATE));
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

  onSearch(searchKeyword) {
    // console.log("Searching keyword", searchKeyword);
    this.setState({
      searchKeyword
    });
  }

  onSearchClose() {
    this.setState({
      search: false
    });
  }

  enableSearchMode(e) {
    e.stopPropagation();
    e.preventDefault();

    // call search cb
    this.setState({
      search: true,
      allowScroll: false
    });
  }

  render() {
    const { forms } = this.props;

    let header = (!this.state.search) ? (
      <SectionTitle
        title="Form List"
        rightIcons={[{
            icon: 'fa-search',
            tip: {
              content: 'Search a Form. For now only the forms that are currently loaded.',
              placement: 'bottom'
            },
            onClick: (e) => this.enableSearchMode(e)
          }, {
            icon: 'fa-refresh',
            spin: true,
            showOn: forms.isFetching
          }, {
            icon: 'fa-refresh',
            showOn: !forms.isFetching,
            onClick: (e) => this.refreshFormList(e),
            tip: {
              content: 'Refresh',
              placement: 'bottom'
            }
          },{
            icon: 'fa-th-list'
          }
        ]}
      />
    ) : (
      <SearchBar
        ref={(search) => this.searchref = search}
        searchPlaceholder="Type to search a form"
        defaultSearch={this.state.searchKeyword}
        onSearchClose={() => this.onSearchClose()}
        onSearch={(keyword) => this.onSearch(keyword)}
      />
    );

    let formItems = [...forms.items];
    // modify form items for search mode
    if (this.state.search && !isEmpty(this.state.searchKeyword)) {
      let value = this.state.searchKeyword.toLowerCase();
      formItems = formItems.filter((item) => {
        return !!~item.title.toLowerCase().indexOf(value);
      });
    }

    let content = <Loading text="Loading Forms" spinnerName="three-bounce"/>;
    if (!isEmpty(formItems)) {
      content = (
        <List
          ref="list"
          name="formpicker"
          items={formItems}
          itemId={(form) => form.id}
          selected={forms.selected}
          primaryProp={(form) => this.formatPrimaryText(form)}
          secondaryProp={(form) => this.formatSecondaryText(form)}
          onItemSelect={(form) => this.selectForm(form)}
          rightIcon={(form) => this.setRightIcon(form)}
          infiniteScroll={{
            enabled: this.state.allowScroll,
            start: 1,
            isFetching: forms.isFetching,
            onLoadMore: this.props.onLoadMore,
            loadingText: 'Loading forms...'
          }}
        />
      );
    } else {
      content = (
        <CenterText
          text="No forms to display"
          icon={ <Icon name="fa-warning" /> }
        />
      );
    }

    return (
      <div className="division formpicker-cont" id="formpicker">
        { header }
        { content }
      </div>
    );
  }
}

export default FormPicker;
