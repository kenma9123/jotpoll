import thunk from 'redux-thunk';
import api from './api';
import poll from './poll';
import result from './result';
import stepActions from './stepActions';

const middlewares = [
  thunk,
  api,
  poll,
  result,
  stepActions
];

export default middlewares;
