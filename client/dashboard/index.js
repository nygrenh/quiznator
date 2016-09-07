import 'babel-polyfill';

import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import { syncHistoryWithStore } from 'react-router-redux'
import { browserHistory } from 'react-router'

import App from 'components/app';

import store from 'state/store';

import { hideMainLoader } from 'common-utils/main-loader';
import { userHasTokens } from 'common-utils/authentication';
import { fetchProfile } from 'state/user';

const history = syncHistoryWithStore(browserHistory, store);

function allSet() {
  hideMainLoader();

  render(
    <Provider store={store}>
      <App history={history}/>
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
