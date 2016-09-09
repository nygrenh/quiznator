import { createReducer } from 'redux-create-reducer';

import { FETCH_PEER_REVIEWS, FETCH_PEER_REVIEWS_FAIL, FETCH_PEER_REVIEWS_SUCCESS } from './actions';

function updatePeerReviews(state, id, update) {
  const peerReviews = state[id] || {};

  return Object.assign({}, state, { [id]: Object.assign({}, peerReviews, update) });
}

export default createReducer({}, {
  [FETCH_PEER_REVIEWS](state, action) {
    return updatePeerReviews(state, action.quizId, { loading: true });
  },
  [FETCH_PEER_REVIEWS_FAIL](state, action) {
    const id = action.meta.previousAction.quizId;

    return updatePeerReviews(state, id, { loading: false, error: true });
  },
  [FETCH_PEER_REVIEWS_SUCCESS](state, action) {
    return updatePeerReviews(state, action.meta.previousAction.quizId, { loading: false, error: false, data: action.payload.data });
  }
});
