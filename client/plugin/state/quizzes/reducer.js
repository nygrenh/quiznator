import scour from 'scourjs';

import { createReducer } from 'redux-create-reducer';

import { FETCH_QUIZ, FETCH_QUIZ_FAIL, FETCH_QUIZ_SUCCESS, SET_QUIZ_AS_SUBMITTED } from './actions';

export default createReducer({}, {
  [SET_QUIZ_AS_SUBMITTED](state, action) {
    return scour(state)
      .set([action.id, 'submitted'], true)
      .value;
  },
  [FETCH_QUIZ](state, action) {
    return scour(state)
      .set([action.id, 'loading'], true)
      .value;
  },
  [FETCH_QUIZ_FAIL](state, action) {
    const id = action.meta.previousAction.id;

    return scour(state)
      .go(id)
      .extend({ loading: false, error: true })
      .root
      .value;
  },
  [FETCH_QUIZ_SUCCESS](state, action) {
    const id = action.meta.previousAction.id;

    return scour(state)
      .go(id)
      .extend({ loading: false, error: false, data: action.payload.data })
      .root
      .value;
  }
});
