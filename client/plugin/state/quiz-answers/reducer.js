import get from 'lodash.get';

import { createReducer } from 'redux-create-reducer';

import { UPDATE_QUIZ_ANSWER, FETCH_QUIZ_ANSWER_SUCCESS } from './actions';

function updateQuizAnswer(state, id, update) {
  const quizAnswer = state[id] || {};

  return Object.assign({}, state, { [id]: Object.assign({}, quizAnswer, update) });
}

export default createReducer({}, {
  [UPDATE_QUIZ_ANSWER](state, action) {
    return updateQuizAnswer(state, action.quizId, { data: action.data });
  },
  [FETCH_QUIZ_ANSWER_SUCCESS](state, action) {
    if(get(action, 'payload.data[0]')) {
      const answer = action.payload.data[0];

      return updateQuizAnswer(state, answer.quizId, { data: answer.data, isOld: true });
    } else {
      return state;
    }
  }
});
