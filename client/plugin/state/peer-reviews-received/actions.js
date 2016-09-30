export const REMOVE_PEER_REVIEWS_RECEIVED = 'PEER_REVIEWS_RECEIVED::REMOVE_PEER_REVIEWS_RECEIVED';
export const FETCH_PEER_REVIEWS_RECEIVED = 'PEER_REVIEWS_RECEIVED::FETCH_PEER_REVIEWS_RECEIVED';
export const FETCH_PEER_REVIEWS_RECEIVED_SUCCESS = 'PEER_REVIEWS_RECEIVED::FETCH_PEER_REVIEWS_RECEIVED_SUCCESS';
export const FETCH_PEER_REVIEWS_RECEIVED_FAIL = 'PEER_REVIEWS_RECEIVED::FETCH_PEER_REVIEWS_RECEIVED_FAIL';

export function loadPeerReviewsReceived(quizId) {
  return (dispatch, getState) => {
    const { user } = getState();

    if(user.id) {
      return dispatch(fetchPeerReviewsReceived({ quizId, answererId: user.id }));
    }
  }
}

export function removePeerReviewsReceived() {
  return {
    type: REMOVE_PEER_REVIEWS_RECEIVED
  }
}

export function fetchPeerReviewsReceived({ quizId, answererId }) {
  return {
    type: FETCH_PEER_REVIEWS_RECEIVED,
    quizId,
    payload: {
      request: {
        url: `/quizzes/${quizId}/peer-reviews-received/${answererId}`,
        method: 'GET'
      }
    }
  }
}
