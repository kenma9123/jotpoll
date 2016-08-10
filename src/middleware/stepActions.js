import { batchActions } from 'redux-batched-actions';

export default store => next => action => {

  const { steps } = action;

  // if no steps leave it
  if (typeof steps === 'undefined') {
    return next(action);
  }

  // console.log('Step actions middleware', action);

  // for types that contains action creators
  store.dispatch(batchActions(steps));

  return;
}
