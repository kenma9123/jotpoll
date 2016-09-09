import * as types from '../constants/ActionTypes';
import createReducer from '../utils/createReducer';

const initialState = {
  isFetching: false,
  error: {},
  selected: {},
  items: []
};

export default createReducer({
  [types.Question.toggle]: (state, action) => {
    let { question } = action.payload;
    return  {
      ...state,
      selected: question
    };
  },
  [types.Questions.fetch]: (state, action) => {
    return {
      ...state,
      isFetching: true
    };
  },
  [types.Questions.success]: (state, action) => {
    let { response } = action.payload;
    return {
      ...state,
      isFetching: false,
      items: response.result
    };
  },
  [types.Questions.failed]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: action.payload
    };
  },

  // reset to initial state every time a form toggles
  [types.Form.toggle]: (state, action) => {
    return  {
      ...state,
      ...initialState
    };
  }
}, initialState);
