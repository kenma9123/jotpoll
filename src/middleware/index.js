import thunk from 'redux-thunk';
import api from './api';
import stepActions from './stepActions';

const middlewares = [
  thunk,
  api,
  stepActions
];

export default middlewares;
