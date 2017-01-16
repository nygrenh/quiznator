import scour from 'scourjs';
import lget from 'lodash.get';

import { createReducer } from 'redux-create-reducer';

import { REMOVE_QUIZ_ANSWERS, SET_QUIZ_ANSWER_DATA_PATH, FETCH_QUIZ_ANSWER, FETCH_QUIZ_ANSWER_SUCCESS, FETCH_PEER_REVIEWS_GIVEN, FETCH_PEER_REVIEWS_GIVEN_SUCCESS, POST_QUIZ_ANSWER, POST_QUIZ_ANSWER_FAIL, POST_QUIZ_ANSWER_SUCCESS } from './actions';

function setNotSubmitting(state, quizId) {
  return scour(state)
    .go(quizId)
    .extend({ submitting: false })
    .root;
}

export default createReducer({}, {
  [REMOVE_QUIZ_ANSWERS](state, action) {
    return {};
  },
  [SET_QUIZ_ANSWER_DATA_PATH](state, action) {
    return scour(state)
      .set([action.quizId, 'data', ...action.path], action.value)
      .set([action.quizId, 'isTouched'], true)
      .value;
  },
  [FETCH_QUIZ_ANSWER](state, action) {
    return scour(state)
      .go(action.quizId)
      .extend({ loading: true, answererId: action.answererId })
      .root
      .value;
  },
  [FETCH_QUIZ_ANSWER_SUCCESS](state, action) {
    if(lget(action, 'payload.data[0]')) {
      const answer = action.payload.data[0];
      const populateAnswers = !!lget(action, 'meta.previousAction.populateAnswers');

      return scour(state)
        .go(answer.quizId)
        .extend({ data: populateAnswers ? answer.data : null, isOld: true, loading: false })
        .root
        .value;
    } else {
      return state;
    }
  },
  [FETCH_PEER_REVIEWS_GIVEN](state, action) {
    return scour(state)
      .go(action.quizId)
      .extend({ loading: true, answererId: action.answererId })
      .root
      .value;
  },
  [FETCH_PEER_REVIEWS_GIVEN_SUCCESS](state, action) {
    if(lget(action, 'payload.data[0]')) {
      const quizId = action.meta.previousAction.quizId;
      const review = action.payload.data[0];

      return scour(state)
        .go(quizId)
        .extend({ data: review, loading: false, isOld: true })
        .root
        .value;
    } else {
      return state;
    }
  },
  [POST_QUIZ_ANSWER](state, action) {
    return scour(state)
      .go(action.quizId)
      .extend({ submitting: true })
      .root
      .value;
  },
  [POST_QUIZ_ANSWER_SUCCESS](state, action) {
    return setNotSubmitting(state, action.meta.previousAction.quizId).value;
  },
  [POST_QUIZ_ANSWER_FAIL](state, action) {
    return setNotSubmitting(state, action.meta.previousAction.quizId).value;
  }
});
