import * as types from '../constants/ActionTypes';
import { SERVER_URL } from '../config';

export function setUserAPIkey(apikey) {
  return {
    type: types.User.setAPIkey,
    payload: {
      apikey
    }
  };
}

export function loginUser(apikey) {
  return {
    types: [types.User.login, types.User.loginSuccess, types.User.loginFailed],
    endpoint: SERVER_URL,
    payload: {
      method: 'POST',
      data: {
        action: 'loginUser',
        apikey
      }
    }
  };
}
