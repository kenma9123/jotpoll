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
  [types.Form.toggle]: (state, action) => {
    return  {
      ...state,
      selected: action.form
    };
  },
  [types.Forms.fetch]: (state, action) => {
    return {
      ...state,
      isFetching: true
    };
  },
  [types.Forms.success]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      items: action.response.result
    };
  },
  [types.Forms.failed]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: action.error
    };
  }
}, initialState);
