import * as types from '../constants/ActionTypes';
import createReducer from '../utils/createReducer';
import { filter } from 'lodash/collection';

const initialState = {
  isFetching: false,
  error: {},
  selected: {},
  items: []
};

export default createReducer({
  [types.Question.toggle]: (state, action) => {
    return  {
      ...state,
      selected: filter(state.items, (form) =>
        (form.id === action.id)
      )[0]
    };
  },
  [types.Questions.fetch]: (state, action) => {
    return {
      ...state,
      isFetching: true
    };
  },
  [types.Questions.success]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      items: action.response.result
    };
  },
  [types.Questions.failed]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: action.error
    };
  }
}, initialState);
