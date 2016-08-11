import * as types from '../constants/ActionTypes';
import createReducer from '../utils/createReducer';

// for testing recreate apikey.json with
// {apikey:<value>}
let apikey = require('../config/apikey.json');
const initialState = {
  isLoggedIn: true,
  details: {
    name: 'Kenneth Palaganas'
  },
  apikey: apikey.apikey
};

export default createReducer({
  [types.User.login]: (state, action) => {
    return {
      ...state,
      isLoggedIn: true,
      details: action.details,
      apikey: action.apikey
    };
  },
  [types.User.logout]: (state, action) => {
    return {
      ...state,
      isLoggedIn: false,
      details: {},
      apikey: ''
    };
  },
}, initialState);
