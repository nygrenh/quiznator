import scour from 'scourjs';

import { createReducer } from 'redux-create-reducer';

import { REMOVE_PEER_REVIEWS, FETCH_PEER_REVIEWS, FETCH_PEER_REVIEWS_FAIL, FETCH_PEER_REVIEWS_SUCCESS } from './actions';

export default createReducer({}, {
  [REMOVE_PEER_REVIEWS](state, action) {
    return {};
  },
  [FETCH_PEER_REVIEWS](state, action) {
    return scour(state)
      .set([action.quizId, 'loading'], true)
      .value;
  },
  [FETCH_PEER_REVIEWS_FAIL](state, action) {
    const id = action.meta.previousAction.quizId;

    return scour(state)
      .go(id)
      .extend({ loading: false, error: true })
      .root
      .value;
  },
  [FETCH_PEER_REVIEWS_SUCCESS](state, action) {
    const id = action.meta.previousAction.quizId;

    return scour(state)
      .go(id)
      .extend({ loading: false, error: false, data: action.payload.data })
      .root
      .value;
  }
});
