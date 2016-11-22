import 'babel-polyfill';

import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import { syncHistoryWithStore } from 'react-router-redux'
import { browserHistory, Router } from 'react-router'

import Routes from 'routes';

import store from 'state/store';

import { hideMainLoader } from 'common-utils/main-loader';
import { userHasTokens } from 'common-utils/authentication';
import { fetchProfile } from 'state/user';

import routes from 'routes';

const history = syncHistoryWithStore(browserHistory, store);

function allSet() {
  hideMainLoader();

  render(
    <Provider store={store}>
      <Router history={history}>
        {routes}
      </Router>
    </Provider>,
    document.getElementById('root')
  );
}

if(!userHasTokens()) {
  window.location.replace('/sign-in');
} else {
  store.dispatch(fetchProfile())
    .then(allSet);
}
