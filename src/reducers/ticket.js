import * as types from '../constants/ActionTypes';
import createReducer from '../utils/createReducer';

const initialState = {
  isFetching: false,
  data: {},
  error: {}
};

function fetchHandler(state, action) {
  return {
    ...state,
    error: {},
    isFetching: true
  };
}

function successHandler(state, action) {
  console.log(state, action);
  const { memberkit } = action.response;
  return {
    ...state,
    isFetching: false,
    data: memberkit.result
  };
}

function failureHandler(state, action) {
  const { memberkit } = action.response;
  return {
    ...state,
    isFetching: false,
    error: memberkit.result
  };
}

export default createReducer({
  [types.TICKET_FETCH]: fetchHandler,
  [types.TICKET_FETCH_SUCCESS]: successHandler,
  [types.TICKET_FETCH_FAILURE]: failureHandler,
  [types.TICKET_FETCH_RANDOM]: fetchHandler,
  [types.TICKET_FETCH_RANDOM_SUCCESS]: successHandler,
  [types.TICKET_FETCH_RANDOM_FAILURE]: failureHandler
}, initialState);
