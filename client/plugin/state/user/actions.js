export const SET_USER = 'USER::SET_USER';

import { removeQuizAnswers } from 'state/quiz-answers';
import { removePeerReviews } from 'state/peer-reviews';
import { removePeerReviewsReceived } from 'state/peer-reviews-received';

export function setUser(user) {
  return {
    type: SET_USER,
    user
  }
}

export function removeUser() {
  return dispatch => {
    dispatch(setUser({}));
    dispatch(removeQuizAnswers());
    dispatch(removePeerReviews());
    dispatch(removePeerReviewsReceived());
  }
}
