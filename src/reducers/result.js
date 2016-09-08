import * as types from '../constants/ActionTypes';
import createReducer from '../utils/createReducer';

const initialState = {
  id: '',
  isFetching: false,
  form_id: '',
  question_id: '',
  options: {},
  poll: {},
  error: {}
};

export default createReducer({
  [types.Result.fetch]: (state, action) => {
    return {
      ...state,
      isFetching: true
    };
  },
  [types.Result.success]: (state, action) => {
    let { result } = action.payload;
    return {
      ...state,
      isFetching: false,
      ...result
    };
  },
  [types.Result.failed]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: action.payload
    };
  }
}, initialState);
