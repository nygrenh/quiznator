export const FETCH_QUIZ = 'QUIZES_FETCH_QUIZ';
export const FETCH_QUIZ_SUCCESS = 'QUIZES_FETCH_QUIZ_SUCCESS';
export const FETCH_QUIZ_FAIL = 'QUIZES_FETCH_QUIZ_FAIL';
export const SET_QUIZ_AS_SUBMITTED = 'QUIZES_SET_QUIZ_AS_SUBMITTED';

import { createQuizAnswer } from 'state/quiz-answers';
import { createTemporalAlert } from 'state/quiz-alerts';

export function submitQuiz(id) {
  return (dispatch, getState) => {
    const { quizAnswers } = getState();

    dispatch(setQuizAsSubmitted(id));

    return dispatch(createQuizAnswer({ quizId: id, data: quizAnswers[id].data }))
      .then(() => {
        return dispatch(createTemporalAlert({ quizId: id, type: 'success', content: 'Your answer has been saved' }));
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
