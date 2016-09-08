import * as types from '../constants/ActionTypes';
import { SERVER_URL } from '../config';

export function setPollItems(items) {
  return {
    type: types.Poll.setItems,
    payload: {
      items
    }
  };
}

export function updatePollItem(item) {
  return {
    type: types.Poll.updateItem,
    payload: {
      item
    }
  };
}

export function savePoll(payload) {
  return {
    types: [types.Poll.save, types.Poll.saveSuccess, types.Poll.saveFailed],
    endpoint: SERVER_URL,
    payload: {
      method: 'POST',
      data: {
        action: 'savePoll',
        ...payload
      }
    }
  };
}