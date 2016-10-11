import React, { Component, PropTypes } from 'react';
import InputBox from './InputBox';

class Search extends Component {

  static propTypes = {
    onSearch: PropTypes.func,
    onSearchBlur: PropTypes.func,
    onSearchClose: PropTypes.func,
    searchPlaceholder: PropTypes.string,
    defaultSearch: PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  onSearchBlur(e) {
    const { onSearchBlur = false } = this.props;
    onSearchBlur && onSearchBlur();
  }

  onSearch(e) {
    const { onSearch = false } = this.props;
    if (onSearch) {
      const value = this.searchbox.getValue();
      onSearch(value);
    }
  }

  searchClose(e) {
    const { onSearchClose = false } = this.props;
    onSearchClose && onSearchClose();
  }

  render() {

    const { searchPlaceholder, defaultSearch = ''} = this.props;

    return (
      <div className="section-title">
        <div className="search-component">
          <div className="section-search animated flipInX">
            <InputBox
              ref={(input) => this.searchbox = input}
              className="searchbox"
              placeholder={searchPlaceholder || "Type to search"}
              onBlur={(e) => this.onSearchBlur(e)}
              onKeyUp={(e) => this.onSearch(e)}
              defaultValue={defaultSearch}
            />
            <div className="search-close cu-pointer" onClick={(e) => this.searchClose(e)}>
              <i className="fa fa-close"></i>
            </div>
          </div>
          { false && <div className="section-search-content animated fadeIn">

          </div> }
        </div>
      </div>
    );
  }

}

export default Search;
