import React, { Component, PropTypes } from 'react';
import { isEmpty, isEqual } from 'lodash/lang';
import { sortBy } from 'lodash/collection';
import { SUPPORTED_QUESTIONS } from '../config';
import '../styles/questionpicker.scss';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ActionCreators from '../actions';
import { routeActions } from 'react-router-redux';

import List from './List';

class QuestionPicker extends Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
    forms: PropTypes.object.isRequired,
    questions: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    // load form list if empty
    // const { actions, forms, questions, user } = this.props;
    // if (isEmpty(forms.selected)) {
    //   actions.fetchAndFilterForms(user.apikey);
    // }
  }

  componentWillReceiveProps(nextProps) {
    if (!isEmpty(nextProps.forms.selected) &&
      !isEqual(this.props.forms.selected,
        nextProps.forms.selected) && !nextProps.questions.isFetching) {
      const { actions, forms, user } = nextProps;
      actions.fetchQuestions(forms.selected.id, user.apikey);
    }
  }

  extractHTMLContent(s) {
    var span= document.createElement('span');
    span.innerHTML= s;
    return span.textContent || span.innerText;
  }

  truncate(string){
    if (string && string.length > 30) {
      return string.substring(0, 30) + '...';
    } else {
      return string;
    }
  }

  selectQuestion(question) {
    this.props.actions.toggleQuestion(question);
  }

  render() {
    const { forms, questions } = this.props;
    let content = <div>Select a form first</div>;
    if (!isEmpty(forms.selected)) {
      if (questions.isFetching) {
        content = <div>Loading Questions for form { forms.selected.title }...</div>;
      } else if (!isEmpty(questions.items)) {

        // modify control text to not show its HTML content
        let newItems = [];
        questions.items.forEach((item) => {
          item.supported = (!!~SUPPORTED_QUESTIONS.indexOf(item.type)) ? true : false;
          if (item.type === 'control_text') {
            item.text = this.extractHTMLContent(item.text);
          }

          item.text = this.truncate(item.text);

          newItems.push(item);
        });

        newItems = sortBy(newItems, function(item) { return !item.supported; });

        console.log("new Items", newItems);

        if (!isEmpty(newItems)) {
          content = (
            <List
              name="questionpicker"
              items={newItems}
              primaryProp={'text'}
              secondaryProp={'type'}
              disableUnsupported={true}
              selected={questions.selected}
              onItemSelect={(question) => this.selectQuestion(question)}
            />
          );
        } else {
          content = <div>No questions supported</div>;
        }
      }
    }

    return (
      <div className="division questionpicker-cont">
          <div className="section-title">
            Question List
            <span className="icon-container">
              <i className="fa fa-th-list"></i>
            </span>
          </div>
        { content }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    forms: state.forms,
    questions: state.questions,
    user: state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, ActionCreators, routeActions), dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuestionPicker);
