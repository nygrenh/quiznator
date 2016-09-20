import 'babel-polyfill';

import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';

import App from 'components/app';

import store from 'state/store';

import { hideMainLoader } from 'common-utils/main-loader';
import { userHasTokens } from 'common-utils/authentication';

if(userHasTokens()) {
  window.location.replace('/dashboard');
} else {
  hideMainLoader();

  render(
    <Provider store={store}>
      <App/>
    </Provider>,
    document.getElementById('root')
  );
}
