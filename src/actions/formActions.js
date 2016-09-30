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

const commonFormPayloadData = (opt) => {
  const { apikey, offset, limit } = opt;
  return {
    apikey,
    offset,
    limit,
    action: 'formList',
    orderby: 'updated_at',
    filter: {
      status: 'ENABLED'
    }
  };
};

export function fetchAndFilterForms(apikey, offset, limit) {
  return {
    types: [types.Forms.fetch, types.Forms.success, types.Forms.failed],
    endpoint: SERVER_URL,
    payload: {
      method: 'POST',
      data: commonFormPayloadData({apikey, offset, limit})
    }
  };
}

export function refreshForms(apikey, offset, limit) {
  return {
    types: [types.Forms.fetch, types.Forms.refreshSuccess, types.Forms.failed],
    endpoint: SERVER_URL,
    payload: {
      method: 'POST',
      data: commonFormPayloadData({apikey, offset, limit})
    }
  };
}
