import { combineReducers } from 'redux';
import user from './user';
import forms from './forms';
import questions from './questions';
import { routerReducer } from 'react-router-redux';

const rootReducer = combineReducers({
  user,
  forms,
  questions,
  routing: routerReducer
});

export default rootReducer;
