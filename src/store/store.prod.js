import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { enableBatching } from 'redux-batched-actions';
import rootReducer from '../reducers';
import middlewares from '../middleware';

// put history to middleware - for routing
// import { syncHistory } from 'react-router-redux';
// import browserHistory from '../components/History';
// const reduxRouterMiddleware = syncHistory(browserHistory('production'));
// middlewares.push(reduxRouterMiddleware);

// applyMiddleware supercharges createStore with middleware:
let enhancer = applyMiddleware(...middlewares);

export function configureStore(initialState) {
  const store = createStore(enableBatching(rootReducer), initialState, enhancer);

  // listen for replaying actions from devtools to work
  // reduxRouterMiddleware.listenForReplays(store);

  return store;
}


