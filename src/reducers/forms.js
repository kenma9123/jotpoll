import * as types from '../constants/ActionTypes';
import createReducer from '../utils/createReducer';

const initialState = {
  isFetching: false,
  isLoaded: false,
  error: {},
  selected: {},
  items: []
};

export default createReducer({
  [types.Form.toggle]: (state, action) => {
    let { form } = action.payload;
    return  {
      ...state,
      selected: form
    };
  },
  [types.Forms.fetch]: (state, action) => {
    return {
      ...state,
      isFetching: true
    };
  },
  [types.Forms.success]: (state, action) => {
    let { response } = action.payload;
    return {
      ...state,
      isLoaded: true,
      isFetching: false,
      items: response.result
    };
  },
  [types.Forms.failed]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: action.payload
    };
  }
}, initialState);
