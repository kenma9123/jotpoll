import thunk from 'redux-thunk';
import api from './api';
import poll from './poll';
import chart from './chart';
import result from './result';
import stepActions from './stepActions';

const middlewares = [
  thunk,
  api,
  poll,
  chart,
  result,
  stepActions
];

export default middlewares;
