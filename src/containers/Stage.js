import React, { Component, PropTypes } from 'react';
import { hashHistory } from 'react-router';
import classNames from 'classnames';
import { isUndefined, isEmpty } from 'lodash/lang';
import DocumentTitle  from 'react-document-title';
import Link from 'react-router/lib/Link';

export default class Stage extends Component {

  static propTypes = {
    ticket: PropTypes.object,
    actions: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { ticket,  } = this.props;
    return (
      <DocumentTitle title='Weebly App'>
        <div>
            Hello World
            <Link to="/test">Test</Link>
        </div>
      </DocumentTitle>
    );
  }
}