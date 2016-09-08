import React, { Component, PropTypes } from 'react';
import DocumentTitle  from 'react-document-title';

import ResultView from '../components/ResultView';

class Result extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <DocumentTitle title='JotPoll Results'>
        <section id="result-view" className="section">
          <ResultView id={this.props.params.resultid}/>
        </section>
      </DocumentTitle>
    );
  }
}

export default Result;
