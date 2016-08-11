import React, { Component, PropTypes } from 'react';
import DocumentTitle  from 'react-document-title';
import Link from 'react-router/lib/Link';

import FormPicker from '../components/FormPicker';
import QuestionPicker from '../components/QuestionPicker';

class Stage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <DocumentTitle title='JotPoll'>
        <section id="stage-root" className="jotpoll section">
          <FormPicker />
          <QuestionPicker />
        </section>
      </DocumentTitle>
    );
  }
}

export default Stage;
