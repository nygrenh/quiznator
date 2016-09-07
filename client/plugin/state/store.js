import { createStore, applyMiddleware } from 'redux';

import thunk from 'redux-thunk';
import axiosMiddleware from 'redux-axios-middleware';

import reducer from './reducer';

import axiosClient from 'utils/axios-client';

export default createStore(
  reducer,
  applyMiddleware(thunk, axiosMiddleware(axiosClient))
);
