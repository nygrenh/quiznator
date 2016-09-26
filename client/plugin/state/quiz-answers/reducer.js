import scour from 'scourjs';
import _get from 'lodash.get';

import { createReducer } from 'redux-create-reducer';

import { SET_QUIZ_ANSWER_DATA_PATH, FETCH_QUIZ_ANSWER, FETCH_QUIZ_ANSWER_SUCCESS, POST_QUIZ_ANSWER, POST_QUIZ_ANSWER_FAIL, POST_QUIZ_ANSWER_SUCCESS } from './actions';

function setNotSubmitting(state, quizId) {
  return scour(state)
    .go(quizId)
    .extend({ submitting: false });
}

export default createReducer({}, {
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
    if(_get(action, 'payload.data[0]')) {
      const answer = action.payload.data[0];

      return scour(state)
        .go(answer.quizId)
        .extend({ data: answer.data, isOld: true, loading: false })
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
