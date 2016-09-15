export const FETCH_PEER_REVIEWS = 'PEER_REVIEWS_FETCH_PEER_REVIEWS';
export const FETCH_PEER_REVIEWS_SUCCESS = 'PEER_REVIEWS_FETCH_PEER_REVIEWS_SUCCESS';
export const FETCH_PEER_REVIEWS_FAIL = 'PEER_REVIEWS_FETCH_PEER_REVIEWS_FAIL';
export const POST_PEER_REVIEWS = 'PEER_REVIEWS_POST_PEER_REVIEWS';

export function loadPeerReviews(quizId) {
  return (dispatch, getState) => {
    const { user } = getState();

    if(user.id) {
      return dispatch(fetchPeerReviews({ quizId, answererId: user.id }));
    }
  }
}

export function createPeerReview({ quizId, sourceQuizId }) {
  return (dispatch, getState) => {
    const state = getState();

    const { review, chosenQuizAnswerId, rejectedQuizAnswerId, targetAnswererId } = state.quizAnswers[sourceQuizId].data || {};

    const peerReview = {
      quizId,
      sourceQuizId,
      review,
      chosenQuizAnswerId,
      rejectedQuizAnswerId,
      giverAnswererId: state.user.id
    }

    return dispatch(postPeerReviews(peerReview));
  }
}

export function postPeerReviews(peerReview) {
  return {
    type: POST_PEER_REVIEWS,
    peerReview,
    payload: {
      request: {
        url: `/quizzes/${peerReview.quizId}/peer-reviews`,
        method: 'POST',
        data: peerReview
      }
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
