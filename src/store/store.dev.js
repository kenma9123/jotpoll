import React from 'react';
import { compose, createStore, applyMiddleware } from 'redux';
import { enableBatching } from 'redux-batched-actions';
import { persistState } from 'redux-devtools';
import rootReducer from '../reducers';
import middlewares from '../middleware';
import DevTools from '../containers/DevTools';

// applyMiddleware supercharges createStore with middleware:
let enhancer = compose(
  // Enables your middleware:
  applyMiddleware(...middlewares),
  // Required! Enable Redux DevTools with the monitors you chose
  DevTools.instrument(),
  // Optional. Lets you write ?debug_session=<key> in address bar to persist debug sessions
  persistState(getDebugSessionKey())
);

function getDebugSessionKey() {
  // You can write custom logic here!
  // By default we try to read the key from ?debug_session=<key> in the address bar
  const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/);
  return (matches && matches.length > 0)? matches[1] : null;
}

export function configureStore(initialState) {
  const store = createStore(enableBatching(rootReducer), initialState, enhancer);

  // listen for replaying actions from devtools to work
  // reduxRouterMiddleware.listenForReplays(store);

  return store;
}
