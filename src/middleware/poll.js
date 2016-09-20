import * as types from '../constants/ActionTypes';
import * as middlewareActions from '../actions/middlewareActions';
import isEqual from 'lodash/isEqual';

export default store => next => action => {

  // get current state
  let state = store.getState();

  // if question is toggled generate the poll data items
  if (action.type === types.Question.toggle) {
    let { question } = action.payload;
    return middlewareActions.generateQuestionPollData(question).then((polls) => {
      // set the poll data based from the question options
      next({
        steps: [{
          ...action // dispatch the original toggle action
        }, {
          type: types.Poll.setItems, //dispatch set Items
          payload: {
            items: polls.map((poll) => {
              // only create new data if not existed on the current state
              let existed = state.poll.items.find((item) => {
                if (isEqual(item.key, poll.key) && isEqual(item.label, poll.label)) {
                  return item;
                }
              });

              let data = (existed) ? {...existed} : {...state.poll.defaultItem};
              return {
                ...data,
                ...poll
              };
            })
          }
        }]
      });
    }).catch(() => {
      next(action);
    });
  } else {
    return next(action);
  }
}
