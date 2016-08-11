import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import ListItem from './ListItem';
import { isEqual } from 'lodash/lang';
import { Scrollbars } from 'react-custom-scrollbars';

class List extends Component {

  static propTypes = {
    name: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    selected: PropTypes.object.isRequired,
    onItemSelect: PropTypes.func,
    primaryProp: PropTypes.string.isRequired,
    secondaryProp: PropTypes.string.isRequired,
    disableUnsupported: PropTypes.bool
  };

  selectItem(item) {
    if (item && !this.isNotSupported(item)) {
      this.props.onItemSelect(item);
    } else {
      console.log(item, 'is not supported');
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
    const { items, name, selected, scroll } = this.props;
    const listClassName = classNames(name + '-list', 'list');

    return (
      <Scrollbars autoHide style={{height: this.getScrollHeight()}}>
        <ul className={listClassName}>
          { items.map((item, index) => {
            const isSelected = isEqual(item, selected);
            const listItemClass = classNames('list-item', {
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
                <i className={ iconClass }></i>
                <div className="list-item-content">
                  <div className="primaryText">
                    {item[this.props.primaryProp]}
                  </div>
                  <div className="secondaryText">
                    {item[this.props.secondaryProp]}
                  </div>
                </div>
              </ListItem>
            );
          }) }
        </ul>
      </Scrollbars>
    );
  }
}

export default List;
