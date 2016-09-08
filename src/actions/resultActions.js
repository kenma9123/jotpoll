import * as types from '../constants/ActionTypes';
import { SERVER_URL } from '../config';

export function loadResults(id) {
  return {
    types: [types.Result.fetch, types.Result.success, types.Result.failed],
    endpoint: SERVER_URL,
    payload: {
      data: {
        action: 'result',
        id
      }
    }
  };
}