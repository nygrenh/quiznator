import { createStore, applyMiddleware } from 'redux';

import thunk from 'redux-thunk';
import axiosMiddleware from 'redux-axios-middleware';

import quizAnswerFetchLogic from 'middlewares/quiz-answer-fetch-logic';

import reducer from './reducer';

import axiosClient from 'utils/axios-client';
import { accessTokenInterceptor } from 'utils/axios-interceptors';

const axiosOptions = {
  interceptors: {
    request: [accessTokenInterceptor]
  }
}

export default createStore(
  reducer,
  applyMiddleware(thunk, quizAnswerFetchLogic, axiosMiddleware(axiosClient, axiosOptions))
);
