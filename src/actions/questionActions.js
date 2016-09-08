import * as types from '../constants/ActionTypes';
import { SERVER_URL } from '../config';

/**
 * Questions related action creators
 */
export function toggleQuestion(question) {
  return {
    type: types.Question.toggle,
    payload: {
      question
    }
  };
}

/**
 * will fetch form using the API
 * for this to be catch by api middleware
 * pass types as one of the object properties
 */
export function fetchQuestions(formID, apikey) {
  return {
    types: [types.Questions.fetch, types.Questions.success, types.Questions.failed],
    endpoint: SERVER_URL,
    payload: {
      method: 'POST',
      data: {
        apikey,
        formID,
        action: 'questionList'
      }
    }
  };
}
