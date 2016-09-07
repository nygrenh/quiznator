import { createReducer } from 'redux-create-reducer';

import { FETCH_QUIZ, FETCH_QUIZ_FAIL, FETCH_QUIZ_SUCCESS, SET_QUIZ_AS_SUBMITTED } from './actions';

function updateQuiz(state, id, update) {
  const quiz = state[id] || {};

  return Object.assign({}, state, { [id]: Object.assign({}, quiz, update) });
}

export default createReducer({}, {
  [SET_QUIZ_AS_SUBMITTED](state, action) {
    return updateQuiz(state, action.id, { submitted: true });
  },
  [FETCH_QUIZ](state, action) {
    return updateQuiz(state, action.id, { loading: true });
  },
  [FETCH_QUIZ_FAIL](state, action) {
    const id = action.meta.previousAction.id;

    return updateQuiz(state, id, { loading: false, error: true });
  },
  [FETCH_QUIZ_SUCCESS](state, action) {
    return updateQuiz(state, action.payload.data._id, { loading: false, error: false, data: action.payload.data });

    return state;
  }
});
