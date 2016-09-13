import { createStore, applyMiddleware } from 'redux';

import thunk from 'redux-thunk';
import axiosMiddleware from 'redux-axios-middleware';

import reducer from './reducer';

import { getTokens } from 'common-utils/authentication';
import axiosClient from 'common-utils/axios-client';
import { includeAccessToken, accessTokenErrorHandler } from 'utils/authentication-interceptors';

export default createStore(
  reducer,
  {
    tokens: getTokens()
  },
  applyMiddleware(thunk, axiosMiddleware(axiosClient, { interceptors: { request: [includeAccessToken], response: [accessTokenErrorHandler] } }))
);
