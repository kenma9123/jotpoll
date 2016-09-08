import { combineReducers } from 'redux';
import user from './user';
import forms from './forms';
import questions from './questions';
import chart from './chart';
import poll from './poll';
import result from './result';
import { routerReducer } from 'react-router-redux';

const rootReducer = combineReducers({
  user,
  forms,
  questions,
  chart,
  poll,
  result,
  routing: routerReducer
});

export default rootReducer;
