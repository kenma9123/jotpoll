import * as types from '../constants/ActionTypes';
import { SERVER_URL } from '../config';

export function setChartData(data, options) {
  return {
    type: types.Chart.setData,
    payload: {
      data,
      options
    }
  };
}

export function setChartType(type) {
  return {
    type: types.Chart.setType,
    payload: {
      type
    }
  };
}

export function updateChartOptions(poll) {
  return {
    type: types.Chart.updatePollCtrl,
    payload: {
      poll
    }
  };
}

export function updateChartOptions(key, value) {
  return {
    type: types.Chart.updateOption,
    payload: {
      key,
      value
    }
  };
}

export function generateChart() {
  return {
    type: types.Chart.generate,
    payload: {}
  };
}

export function generateChartWithType(type) {
  return {
    type: types.Chart.generate,
    payload: {
      type
    }
  };
}

export function saveChartOptions() {
  return {
    types: [types.Chart.save, types.Chart.saveSuccess, types.Chart.saveFailed],
    endpoint: SERVER_URL,
    payload: {
      method: 'POST',
      data: {
        apikey,
        formID,
        action: 'questionList'
      }
    }
  };
}
