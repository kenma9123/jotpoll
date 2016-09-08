import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import ListItem from './ListItem';
import { isEqual } from 'lodash/lang';
import { Scrollbars } from 'react-custom-scrollbars';

class List extends Component {

  static propTypes = {
    name: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    onItemSelect: PropTypes.func,
    selected: PropTypes.object,
    primaryProp: PropTypes.func.isRequired,
    secondaryProp: PropTypes.func.isRequired,
    disableUnsupported: PropTypes.bool,
    rightIcon: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      height: this.getScrollHeight(),
      // selected: {}
    };

    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
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
        this.props.onItemSelect(selected);
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

  render() {
    const { items, name, selected, scroll, primaryProp, secondaryProp, rightIcon = false } = this.props;
    const listClassName = classNames(name + '-list', 'list');

    return (
      <Scrollbars autoHide style={{height: this.state.height}}>
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
                onClick={ () => this.selectItem(item) }
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
    );
  }
}

export default List;
