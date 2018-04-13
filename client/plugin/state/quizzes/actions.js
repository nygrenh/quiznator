export const FETCH_QUIZ = 'QUIZZES::FETCH_QUIZ';
export const FETCH_QUIZ_SUCCESS = 'QUIZZES::FETCH_QUIZ_SUCCESS';
export const FETCH_QUIZ_FAIL = 'QUIZZES::FETCH_QUIZ_FAIL';
export const SET_QUIZ_AS_SUBMITTED = 'QUIZZES::SET_QUIZ_AS_SUBMITTED';

import { createQuizAnswer } from 'state/quiz-answers';
import { createPeerReview } from 'state/peer-reviews';
import { createPrivacyAgreement } from 'state/privacy-agreement';

import { createTemporalAlert } from 'state/quiz-alerts';
import { PEER_REVIEW, PRIVACY_AGREEMENT } from 'common-constants/quiz-types';

export function submitQuiz(id) {
  return (dispatch, getState) => {
    const { quizAnswers, quizzes } = getState();

    const quiz = quizzes[id].data;

    dispatch(setQuizAsSubmitted(id));

    let createPromise = {};

    console.log(quiz)
    switch (quiz.type) {
      case PEER_REVIEW: 
        createPromise = dispatch(createPeerReview({ quizId: quiz.data.quizId, sourceQuizId: id }));
        break;
      case PRIVACY_AGREEMENT:
        createPromise = 
          dispatch(createPrivacyAgreement({ quizId: id, data: quizAnswers[id].data }))
            .then(dispatch(createQuizAnswer({ quizId: id, data: quizAnswers[id].data })))
        break;
      default:
        createPromise = dispatch(createQuizAnswer({ quizId: id, data: quizAnswers[id].data }));
    }

/*      const createPromise = quiz.type === PEER_REVIEW
      ? dispatch(createPeerReview({ quizId: quiz.data.quizId, sourceQuizId: id }))
      : dispatch(createQuizAnswer({ quizId: id, data: quizAnswers[id].data }));
 */ 

    console.log(createPromise)
    createPromise
      .then(response => {
        if(response.error) {
          return dispatch(createTemporalAlert({ quizId: id, type: 'danger', content: 'Couldn\'t save your answer' }));
        } else {
          return dispatch(createTemporalAlert({ quizId: id, type: 'success', content: 'Your answer has been saved' }));
        }
      });
  }
}

export function setQuizAsSubmitted(id) {
  return {
    type: SET_QUIZ_AS_SUBMITTED,
    id
  }
}

export function fetchQuiz(id) {
  return {
    type: FETCH_QUIZ,
    id,
    payload: {
      request: {
        url: `/quizzes/${id}`,
        method: 'GET'
      }
    }
  }
}
