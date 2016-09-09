import * as types from '../constants/ActionTypes';
import createReducer from '../utils/createReducer';
import isEqual from 'lodash/isEqual';

const initialState = {
  items: [],
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
  generated: {},
  isSaving: false,
  errors: {}
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
  [types.Poll.save]: (state, action) => {
    return {
      ...state,
      isSaving: true
    };
  },
  [types.Poll.saveSuccess]: (state, action) => {
    let { result } = action.payload.response
    return {
      ...state,
      generated: result,
      isSaving: false
    };
  },
  [types.Poll.saveFailed]: (state, action) => {
    return {
      ...state,
      isSaving: false,
      errors: action.payload
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
