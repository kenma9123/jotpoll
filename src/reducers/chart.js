import * as types from '../constants/ActionTypes';
import createReducer from '../utils/createReducer';

const initialState = {
  type: 'horizontalBar',
  ready: false,
  data: {
    labels: ['Question 1', 'Question 2', 'Question 3', 'Question 4', 'Question 5'],
    datasets: [{
      backgroundColor: ['#34495E', '#34495E', '#34495E', '#34495E', '#34495E'],
      hoverBackgroundColor: ['#3F5973', '#3F5973', '#3F5973', '#3F5973', '#3F5973'],
      data: [31, 99, 39, 66, 40]
    }]
  },
  options: {},
  defaultOptions: {
    legend: {
      display: false,
      fontFamily: 'Roboto'
    },
    title: {
      display: false,
      text: 'Chart Title'
    },
    tooltips: {
      titleFontFamily: 'Roboto',
      enabled: true,
      bodyFontSize: 15,
      bodySpacing: 4
    },
    scales: {
      xAxes: [{
        ticks: {
          min: 0,
          max: 100
        },
        scaleLabel: {
          display: true,
          labelString: 'Percentage (%)'
        }
      }],
      yAxes: [{
        ticks: {
          min: 0,
          max: 100
        },
        scaleLabel: {
          display: true,
          labelString: 'Percentage (%)'
        }
      }]
    }
  }
};

export default createReducer({
  [types.Chart.setType]: (state, action) => {
    let { type } = action.payload;
    return {
      ...state,
      type
    };
  },
  [types.Chart.setData]: (state, action) => {
    let { data, options, type = initialState.type } = action.payload;
    return {
      ...state,
      ready: true,
      type,
      data,
      options
    };
  },
  [types.Chart.setOptions]: (state, action) => {
    let { options } = action.payload;
    return {
      ...state,
      options
    };
  },
  [types.Chart.updateOption]: (state, action) => {
    let options = {...state.options};
    let { key, value } = action.payload;
    if (key in options) {
      options[key] = value;
    }

    return {
      ...state,
      options
    };
  },

  // reset to initial state every time a form toggles
  [types.Form.toggle]: (state, action) => {
    return  {
      ...state,
      ...initialState
    };
  }
}, initialState);
