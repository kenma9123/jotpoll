import * as types from '../constants/ActionTypes';
import createReducer from '../utils/createReducer';
import isEqual from 'lodash/isEqual';

const initialState = {
  items: [{
    qid: 1,
    label: 'Question 1',
    value: 1,
    style: {
      backgroundColor: '#34495E',
      hoverBackgroundColor: '#3F5973'
    }
  }, {
    qid: 2,
    label: 'Question 2',
    value: 2,
    style: {
      backgroundColor: '#34495E',
      hoverBackgroundColor: '#3F5973'
    }
  }, {
    qid: 3,
    label: 'Question 3',
    value: 3,
    style: {
      backgroundColor: '#34495E',
      hoverBackgroundColor: '#3F5973'
    }
  }, {
    qid: 4,
    label: 'Question 4',
    value: 4,
    style: {
      backgroundColor: '#34495E',
      hoverBackgroundColor: '#3F5973'
    }
  }, {
    qid: 5,
    label: 'Question 5',
    value: 5,
    style: {
      backgroundColor: '#34495E',
      hoverBackgroundColor: '#3F5973'
    }
  }],
  defaultItem: {
    label: '',
    value: 0,
    style: {
      backgroundColor: '#34495E',
      borderColor: '#34495E',
      borderWidth: 1,
      hoverBackgroundColor: '#3F5973',
      hoverBorderColor: '#3F5973'
    }
  },
  allowedControls: [
    'control_dropdown','control_radio',
    'control_rating','control_scale'
  ],
  generated: {}
};

export default createReducer({
  [types.Poll.setItems]: (state, action) => {
    let { items } = action.payload;
    return {
      ...state,
      items
    };
  },
  [types.Poll.updateItem]: (state, action) => {
    let oldItems = [...state.items];
    let { item } = action.payload;
    let items = oldItems.map((oldItem) => {
      if (isEqual(oldItem.key, item.key) && isEqual(oldItem.label, item.label)) {
        oldItem = item;
      }
      return oldItem;
    });

    return {
      ...state,
      items
    };
  },
  [types.Poll.saveSuccess]: (state, action) => {
    let { result } = action.payload.response
    return {
      ...state,
      generated: result
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
