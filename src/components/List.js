import React, { Component, PropTypes } from 'react';
import { FORMPICKER_LIMIT } from '../config';
import classNames from 'classnames';
import ListItem from './ListItem';
import { isEqual } from 'lodash/lang';
import { Scrollbars } from 'react-custom-scrollbars';
import Loading from './Loading';

class List extends Component {

  static propTypes = {
    name: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    onItemSelect: PropTypes.func,
    itemId: PropTypes.func,
    selected: PropTypes.object,
    primaryProp: PropTypes.func.isRequired,
    secondaryProp: PropTypes.func.isRequired,
    disableUnsupported: PropTypes.bool,
    rightIcon: PropTypes.func,
    infiniteScroll: PropTypes.object
  };

  constructor(props) {
    super(props);

    const { infiniteScroll = false } = props;
    const page = infiniteScroll.start || 0

    this.state = {
      height: this.getScrollHeight(),
      page: page,
      offset: 0,
      limit: FORMPICKER_LIMIT,
      infiniteScroll: false,
      showLoader: false,
      loaderMessage: infiniteScroll.loadingText || 'Loading...'
      // selected: {}
    };

    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillReceiveProps(nextProps) {
    const { infiniteScroll = false } = nextProps;
    if (infiniteScroll && !infiniteScroll.isFetching) {
      this.setState({
        infiniteScroll: false,
        showLoader: false,
        loaderMessage: infiniteScroll.loadingText
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize(e) {
    this.setState({
      height: this.getScrollHeight()
    });
  }

  selectItem(selected) {
    if (selected && !this.isNotSupported(selected)) {
      // this.setState({
      //   selected
      // }, () => {
      const { onItemSelect = false } = this.props;
      onItemSelect && onItemSelect(selected);
      // });
    } else {
      console.log(selected, 'is not supported');
    }
  }

  isNotSupported(item) {
    let { disableUnsupported = false } = this.props;
    return disableUnsupported && !item.supported;
  }

  getScrollHeight() {
    return window.innerHeight - 60;
  }

  handleScroll(e) {
    // console.log('Handling scroll', e);
    let element = e.srcElement;
    let padding = 0;
    if ((element.scrollHeight - element.scrollTop) <= element.clientHeight + padding) {
      this.loadMore();
    }
  }

  loadMore() {
    const state = { ...this.state };
    const { infiniteScroll = false } = this.props;

    // if no infinitescroll prop object
    // or is in infinitescroll state
    // do not call load more
    if (!infiniteScroll || state.infiniteScroll || !infiniteScroll.enabled) {
      return false;
    }

    this.setState({
      infiniteScroll: true
    }, () => {

      let page = state.page + 1;
      let offset = (page - 1) * state.limit;

      // call the callback
      if (infiniteScroll && infiniteScroll.onLoadMore) {
        infiniteScroll.onLoadMore(offset, state.limit);

        // update state
        this.setState({
          page,
          offset,
          limit: state.limit
        });
      }
    });
  }

  showLoadingOverlay(loaderMessage) {
    this.setState({
      showLoader: true,
      loaderMessage
    });
  }

  hideLoadingOverlay() {
    this.setState({
      showLoader: false
    });
  }

  willLoadLoader() {
    return this.state.infiniteScroll || this.state.showLoader;
  }

  getLoadingComponent(loadingText) {
    return (
      <div className="list-loader-overlay" style={{height: this.state.height}}>
        <Loading text={loadingText} spinnerName="three-bounce"/>
      </div>
    );
  }

  getScrollBar() {
    return this.scrollbar;
  }

  getScrollBarScrollOffset() {
    return this.getScrollBar().refs.view.scrollTop;
  }

  getScrollBarScrollHeight() {
    return this.getScrollBar().refs.view.scrollHeight;
  }

  getScrollBarScrollerHeight() {
    return this.getScrollBar().refs.thumbVertical.clientHeight;
  }

  setScrollBarToOffset(offset) {
    this.getScrollBar().refs.view.scrollTop = offset;
  }

  render() {
    const { items, name, selected, scroll, itemId, primaryProp, secondaryProp, rightIcon = false } = this.props;
    const listClassName = classNames(name + '-list', 'list');

    return (
      <div className="list-container">
        { this.willLoadLoader() && this.getLoadingComponent(this.state.loaderMessage) }
        <Scrollbars
          ref={(scrollbar) => this.scrollbar = scrollbar}
          onScroll={ (e) => this.handleScroll(e) }
          style={{height: this.state.height}}>
          <ul className={listClassName}>
            { items.map((item, index) => {
              const isSelected = isEqual(item, selected);
              const listItemClass = classNames('list-item with-left-icon', {
                'with-right-icon': rightIcon,
                'selected': isSelected,
                'disabled': this.isNotSupported(item)
              });
              const iconClass = classNames('fa', {
                'fa-circle': !isSelected,
                'fa-check-circle': isSelected
              });

              return (
                <ListItem
                  className={listItemClass}
                  key={index}
                  onClick={ (e) => this.selectItem(item) }
                  id={itemId && itemId(item)}
                >
                  <div className="left-icon">
                    <i className={ iconClass }></i>
                  </div>
                  <div className="list-item-content">
                    <div className="primaryText" title={primaryProp(item)}>
                      { primaryProp && primaryProp(item) }
                    </div>
                    <div className="secondaryText">
                      { secondaryProp && secondaryProp(item)  }
                    </div>
                  </div>
                  { rightIcon && <div className="right-icon">
                    { rightIcon(item) }
                  </div>}
                </ListItem>
              );
            }) }
          </ul>
        </Scrollbars>
      </div>
    );
  }
}

export default List;
