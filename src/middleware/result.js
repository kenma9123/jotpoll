import * as types from '../constants/ActionTypes';
import * as middlewareActions from '../actions/middlewareActions';
import forEach from 'lodash/forEach';
import toArray from 'lodash/toArray';
import sum from 'lodash/sum';

export default store => next => action => {

  if (action.type === types.Result.success) {
    let { result } = action.payload.response;

    // get current state
    let state = store.getState();

    // convert the options from old to new
    // passing the default bar styles
    let steps = [];
    return middlewareActions.ConvertOptions(result.options, state.poll.defaultItem.style).then((options) => {
      // set the poll data based from the question options
      let polls = [];
      let index = 0;
      let valueSum = sum(toArray(result.poll.values));
      let { type, values } = result.poll;

      forEach(values, (value, label) => {
        if (type === 'control_scale') {
          label = 'Rate';
          label = `${index + 1} ${label + ((index > 0) ? 's' : '')}`;
        } else if (type === 'control_rating') {
          label = 'Scale';
          label = `${index + 1} ${label + ((index > 0) ? 's' : '')}`;
        }

        polls.push({
          label,
          count: value,
          value: middlewareActions.getPercentage(value, valueSum).toFixed(1),
          style: {
            ...options.bars[index++]
          }
        });
      });

      return next({
        steps: [{
          ...action,
          from: 'middleware',
          payload: {
            result: {
              ...result,
              options
            }
          }
        }, {
          type: types.Poll.setItems, //dispatch set Items
          payload: {
            items: polls
          }
        }, {
          type: types.Chart.setType,
          payload: {
            type: result.options.type
          }
        }]
      });

      // generate chart data
      // return next({
      //   type: types.Chart.generate,
      //   payload: {
      //     type: result.options.type
      //   }
      // });
      // return middlewareActions.generateChartData(result.options.type, polls, result.poll.name).then(({labels, datasets, options}) => {
      //   // set the poll data based from the question options
      //   next({
      //     type: types.Chart.setData, //dispatch set Items
      //     payload: {
      //       type: result.options.type,
      //       data: {
      //         labels,
      //         datasets
      //       },
      //       options: {
      //         ...options,
      //         ...state.chart.options // make sure existing options remain
      //       }
      //     }
      //   });
      // });
    }).catch(() => {
      next(action);
    });
  } else {
    return next(action);
  }
}
