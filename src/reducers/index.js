import { combineReducers } from 'redux';
import ticket from './ticket';
import { routerReducer } from 'react-router-redux';

const rootReducer = combineReducers({
  ticket,
  routing: routerReducer
});

export default rootReducer;
