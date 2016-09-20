import scour from 'scourjs';
import get from 'lodash.get';

import { createReducer } from 'redux-create-reducer';

import { SET_QUIZ_ANSWER_DATA_PATH, FETCH_QUIZ_ANSWER_SUCCESS, POST_QUIZ_ANSWER, POST_QUIZ_ANSWER_SUCCESS } from './actions';

export default createReducer({}, {
  [SET_QUIZ_ANSWER_DATA_PATH](state, action) {
    return scour(state)
      .set([action.quizId, 'data', ...action.path], action.value)
      .set([action.quizId, 'isTouched'], true)
      .value;
  },
  [FETCH_QUIZ_ANSWER_SUCCESS](state, action) {
    if(get(action, 'payload.data[0]')) {
      const answer = action.payload.data[0];

      return scour(state)
        .go(answer.quizId)
        .extend({ data: answer.data, isOld: true })
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
    const quizId = action.meta.previousAction.quizId;

    return scour(state)
      .go(quizId)
      .extend({ submitting: false })
      .root
      .value;
  }
});
