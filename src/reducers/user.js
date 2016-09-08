import * as types from '../constants/ActionTypes';
import createReducer from '../utils/createReducer';

const initialState = {
  isLoggedIn: false,
  isLoggingIn: false,
  isUserReady: false,
  apikey: '',
  details: {},
  errors: {}
};

export default createReducer({
  [types.User.setAPIkey]: (state, action) => {
    let { apikey } = action.payload;
    return {
      ...state,
      apikey
    };
  },
  [types.User.login]: (state, action) => {
    return {
      ...state,
      isLoggingIn: true
    };
  },
  [types.User.loginSuccess]: (state, action) => {
    let { response } = action.payload;
    return {
      ...state,
      isLoggingIn: false,
      isLoggedIn: true,
      details: response.user
    };
  },
  [types.User.loginFailed]: (state, action) => {
    return {
      ...state,
      isLoggingIn: false,
      error: action.payload
    };
  },
  [types.User.logout]: (state, action) => {
    return {
      ...state,
      ...initialState
    };
  }
}, initialState);
