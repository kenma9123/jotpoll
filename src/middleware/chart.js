import * as types from '../constants/ActionTypes';
import * as middlewareActions from '../actions/middlewareActions';
import isEmpty from 'lodash/isEmpty';

export default store => next => action => {

  // get current state
  let state = store.getState();

  // ifaction is generate a chart
  if (action.type === types.Chart.generate) {
    let { label = false, type = state.chart.type } = action.payload;
    let clabel = (!isEmpty(state.questions.selected)) ? state.questions.selected.text : ((label) ? label : 'N/A');
    return middlewareActions.generateChartData(state.poll.items, clabel).then(({labels, datasets}) => {
      console.log("Setting chart data");

      let options = {...state.chart.defaultOptions};

      switch(type) {
        case 'horizontalBar':
          options = {
            ...options,
            tooltips: {
              ...options.tooltips,
              callbacks: {
                label: (opt) => `Value: ${opt.xLabel}%`
              }
            },
            scales: {
              xAxes: options.scales.xAxes
            }
          };
        break;
        case 'bar':
          options = {
            ...options,
            tooltips: {
              ...options.tooltips,
              callbacks: {
                label: (opt) => `Value: ${opt.yLabel}%`
              }
            },
            scales: {
              yAxes: options.scales.yAxes
            }
          };
        break;
        case 'pie':
        case 'doughnut':
        case 'polarArea':
          options = {
            ...options,
            legend: {
              ...options.legend,
              display: true,
              position: 'bottom'
            },
            tooltips: {
              ...options.tooltips,
              callbacks: {
                title: (opt, data) => {
                  console.log(opt, data);
                  return data.labels[opt[0].index];
                },
                label: (opt, data) => {
                  return `Value: ${data.datasets[0].data[opt.index]}%`;
                }
              }
            },
            scales: {
              display: false
            }
          };
        break;
      }

      console.log(options, type);

      // set the poll data based from the question options
      next({
        steps: [{
          ...action // dispatch the original toggle action
        }, {
          type: types.Chart.setData, //dispatch set Items
          payload: {
            type,
            data: {
              labels,
              datasets
            },
            options: {
              ...options
            }
          }
        }]
      });
    });
  } else {
    return next(action);
  }
}
