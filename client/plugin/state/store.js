import { createStore, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'

import thunk from 'redux-thunk';
import quizAnswerFetchLogic from 'middlewares/quiz-answer-fetch-logic';
import privacyAgreementLogic from 'middlewares/privacy-agreement-logic';
import actionPublish from 'middlewares/action-publish';

import reducer from './reducer';

import axiosMiddleware from 'utils/axios-middleware';

const middleware = applyMiddleware(
  thunk, 
  quizAnswerFetchLogic,
  privacyAgreementLogic,
  axiosMiddleware, 
  actionPublish
)

export default createStore(
  reducer,
  {},
  compose(
    middleware,
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);
