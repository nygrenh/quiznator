import { createStore, applyMiddleware } from 'redux';

import thunk from 'redux-thunk';
import quizAnswerFetchLogic from 'middlewares/quiz-answer-fetch-logic';
import privacyAgreementLogic from 'middlewares/privacy-agreement-logic';
import actionPublish from 'middlewares/action-publish';

import reducer from './reducer';

import axiosMiddleware from 'utils/axios-middleware';

export default createStore(
  reducer,
  applyMiddleware(
    thunk, 
    quizAnswerFetchLogic,
    privacyAgreementLogic,
    axiosMiddleware, 
    actionPublish)
);
