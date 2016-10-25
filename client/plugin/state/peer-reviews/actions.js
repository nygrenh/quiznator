export const REMOVE_PEER_REVIEWS = 'PEER_REVIEWS::REMOVE_PEER_REVIEWS';
export const FETCH_PEER_REVIEWS = 'PEER_REVIEWS::FETCH_PEER_REVIEWS';
export const FETCH_PEER_REVIEWS_SUCCESS = 'PEER_REVIEWS::FETCH_PEER_REVIEWS_SUCCESS';
export const FETCH_PEER_REVIEWS_FAIL = 'PEER_REVIEWS::FETCH_PEER_REVIEWS_FAIL';
export const POST_PEER_REVIEWS = 'PEER_REVIEWS::POST_PEER_REVIEWS';

export function loadPeerReviews(quizId) {
  return (dispatch, getState) => {
    const { user } = getState();

    if(user.id) {
      return dispatch(fetchPeerReviews({ quizId, answererId: user.id }));
    } else {
      return Promise.resolve();
    }
  }
}

export function removePeerReviews() {
  return {
    type: REMOVE_PEER_REVIEWS
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
      rejectedQuizAnswerId
    }

    if(state.user.id) {
      return dispatch(createPeerReviewRequest(peerReview));
    } else {
      return Promise.resolve();
    }
  }
}

export function createPeerReviewRequest(peerReview) {
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
