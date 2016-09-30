import * as types from '../constants/ActionTypes';
import { SERVER_URL } from '../config';

/**
 * Form related action creators
 */
export function toggleForm(form) {
  return {
    type: types.Form.toggle,
    payload: {
      form
    }
  };
}

/**
 * will fetch form using the API
 * for this to be catch by api middleware
 * pass types as one of the object properties
 */
export function fetchForms(apikey) {
  return {
    types: [types.Forms.fetch, types.Forms.success, types.Forms.failed],
    endpoint: SERVER_URL,
    payload: {
      method: 'POST',
      data: {
        action: 'formList'
      }
    }
  };
}

export function fetchAndFilterForms(apikey, offset, limit) {
  return {
    types: [types.Forms.fetch, types.Forms.success, types.Forms.failed],
    endpoint: SERVER_URL,
    payload: {
      method: 'POST',
      data: {
        apikey,
        action: 'formList',
        filtered: true,
        offset,
        limit,
        orderby: 'updated_at',
        filter: {
          status: 'ENABLED'
        }
      }
    }
  };
}
