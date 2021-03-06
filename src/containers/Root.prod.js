import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import IndexRoute from 'react-router/lib/IndexRoute';
import Route from 'react-router/lib/Route';
import Router from 'react-router/lib/Router';
import browserHistory from '../components/History';
import NotFound from './NotFound';

import App from './App';
import Stage from './Stage';
import Result from './Result';

export default class Root extends Component {
  render() {
    const { store } = this.props;
    const history = syncHistoryWithStore(browserHistory('production'), store);
    return (
      <Provider store={store}>
        <div>
          <Router history={history}>
            <Route path="/" component={App}>
              <IndexRoute component={Stage} />
              <Route path="result/:resultid" component={Result}/>
            </Route>
            <Route path="*" component={NotFound}/>
          </Router>
        </div>
      </Provider>
    );
  }
}