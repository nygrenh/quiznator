export const FETCH_PEER_REVIEWS = 'PEER_REVIEWS_FETCH_PEER_REVIEWS';
export const FETCH_PEER_REVIEWS_SUCCESS = 'PEER_REVIEWS_FETCH_PEER_REVIEWS_SUCCESS';
export const FETCH_PEER_REVIEWS_FAIL = 'PEER_REVIEWS_FETCH_PEER_REVIEWS_FAIL';

export function loadPeerReviews(quizId) {
  return (dispatch, getState) => {
    const { user } = getState();

    if(user.id) {
      return dispatch(fetchPeerReviews({ quizId, answererId: user.id }));
    }
  }
}

export function fetchPeerReviews({ quizId, answererId }) {
  return {
    type: FETCH_PEER_REVIEWS,
    quizId,
    payload: {
      request: {
        url: `/quizzes/${quizId}/peer-reviews/${answererId}`,
        method: 'GET'
      }
    }
  }
}
