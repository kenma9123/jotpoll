import reqwest from 'reqwest';
import {
  isArray,
  isEmpty
}
from 'lodash/lang';

/**
 * Fetches an API response
 */
const callApi = (options) => {
  const defaultOptions = {
    method: 'get',
    crossOrigin: true
  };
  let req = Object.assign({}, defaultOptions, options);
  return new Promise((resolve, reject) => {
    if (typeof req.url === 'undefined') {
      return reject('Undefined request URL');
    }
    req = reqwest(req);
    req.then(resolve);
    req.fail(reject);
  });
};

// guide http://rackt.org/redux/docs/recipes/ReducingBoilerplate.html
export default store => next => action => {

  const {
    types,
    endpoint = false,
    payload = {}
  } = action;

  // if no endpoint, its not an api action
  if (!endpoint) {
    return next(action);
  }

  if (!isArray(types) ||
    types.length !== 3 ||
    !types.every(type => typeof type === 'string')
  ) {
    throw new Error('Expected an array of three string types.');
  }

  // console.log('API middleware', action);

  const [requestType, successType, failureType] = types;

  // call request action
  store.dispatch({
    type: requestType,
    ...payload
  });

  // call specific action for results
  let requestOptions = {
    url: endpoint
  };

  // if payload exist
  if (!isEmpty(payload)) {
    // payload['data']['user'] = JSON.stringify(window.User);
    requestOptions = {
      ...requestOptions,
      ...payload
    }
  }

  return callApi(requestOptions).then(
    response => next({
      type: successType,
      payload: {
        response
      }
    }),
    error => {
      let errors = JSON.parse(error.responseText);
      next({
        type: failureType,
        payload: errors,
        error: true
      })
    }
  );
}
