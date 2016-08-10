import React from 'react';
import ReactDOM from 'react-dom';
import { configureStore } from './store/configureStore';
import Root from './containers/Root';
import './styles/index.scss';

ReactDOM.render(
  <Root store={configureStore()} />,
  document.getElementById('root')
);
