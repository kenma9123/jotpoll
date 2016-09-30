import React, { Component, PropTypes } from 'react';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import sortBy from 'lodash/sortBy';
import { SUPPORTED_QUESTIONS, QUESTIONTEXT_TRUNCATE } from '../config';
import * as Utils from '../utils';
import '../styles/questionpicker.scss';

import List from './List';
import Loading from './Loading';
import CenterText from './CenterText';
import Icon from './Icon';

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
    span.innerHTML = s;
    return span.textContent || span.innerText;
  }

  selectQuestion(question) {
    this.props.actions.toggleQuestion(question);
  }

  formatSecondaryText(question) {
    const supported = (question.supported) ? <i>Compatible</i> : <i>Incompatible</i>
    return supported;
  }

  render() {
    const { forms, questions } = this.props;
    let content = (
      <CenterText
        text="Select a form"
        icon={
          <Icon
            name="fa-info-circle"
            tip={{
              content: 'You have to select a form to render the questions.'
            }}
          />
        }
      />
    );

    if (!isEmpty(forms.selected)) {
      if (questions.isFetching) {
        content = <Loading text="Loading Questions" spinnerName="three-bounce"/>;
      } else if (!isEmpty(questions.items)) {

        // modify control text to not show its HTML content
        let newItems = [];
        questions.items.forEach((item) => {
          item.supported = (!!~SUPPORTED_QUESTIONS.indexOf(item.type)) ? true : false;
          if (item.type === 'control_text') {
            item.text = this.extractHTMLContent(item.text);
          }

          item.text = Utils.truncate(item.text, QUESTIONTEXT_TRUNCATE);

          newItems.push(item);
        });

        newItems = sortBy(newItems, function(item) { return !item.supported; });

        // console.log("new Items", newItems);

        if (!isEmpty(newItems)) {
          content = (
            <List
              name="questionpicker"
              items={newItems}
              primaryProp={(question) => question.text}
              secondaryProp={(question) => this.formatSecondaryText(question)}
              disableUnsupported={true}
              selected={questions.selected}
              onItemSelect={(question) => this.selectQuestion(question)}
            />
          );
        } else {
          content = <CenterText text="No questions supported" />;
        }
      }
    }

    return (
      <div className="division questionpicker-cont" id="questionpicker">
          <div className="section-title">
            Question List
            <span className="icon-container right">
              <i className="fa fa-th-list"></i>
            </span>
          </div>
        { content }
      </div>
    );
  }
}

export default QuestionPicker;
