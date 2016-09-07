import get from 'lodash.get';

import { createTemporalAlert } from 'state/quiz-alerts';

export const UPDATE_QUIZ_ANSWER = 'QUIZ_ANSWERS_UPDATE_QUIZ_ANSWER';
export const POST_QUIZ_ANSWER = 'QUIZ_ANSWERS_POST_QUIZ_ANSWER';
export const FETCH_QUIZ_ANSWER = 'QUIZ_ANSWERS_FETCH_QUIZ_ANSWER';
export const FETCH_QUIZ_ANSWER_SUCCESS = 'QUIZ_ANSWERS_FETCH_QUIZ_ANSWER_SUCCESS';

function validateAnswerData(data, quiz) {
  const rightAnswer = get(quiz, 'data.meta.rightAnswer');

  if(rightAnswer && data !== rightAnswer) {
    return get(quiz, `data.meta.errors.${data}`) || 'Wrong answer';
  }
}

export function createQuizAnswer({ quizId, data }) {
  return (dispatch, getState) => {
    const { user, quizzes } = getState();

    const quiz = quizzes[quizId].data;
    const hasRightAnswer = !!get(quiz, 'data.meta.rightAnswer');

    if(!user.id || !quiz) {
      return Promise.resolve();
    }

    const errorMessage = validateAnswerData(data, quiz);

    if(hasRightAnswer && errorMessage) {
      dispatch(createTemporalAlert({ content: errorMessage, quizId, type: 'danger', removeDelay: 15000 }));
    } else if(hasRightAnswer && !errorMessage) {
      dispatch(createTemporalAlert({ content: 'Right answer', quizId, type: 'success' }));
    }

    return dispatch(postQuizAnswer({ quizId, data, answererId: user.id }));
  }
}

export function getQuizAnswer({ quizId }) {
  return (dispatch, getState) => {
    const { user } = getState();

    if(user.id) {
      return dispatch(fetchQuizAnswer({ quizId, answererId: user.id }));
    } else {
      return Promise.resolve();
    }
  }
}

export function postQuizAnswer({ quizId, data, answererId }) {
  return {
    type: POST_QUIZ_ANSWER,
    payload: {
      request: {
        url: `/quizzes/${quizId}/answers`,
        method: 'POST',
        data: {
          data,
          answererId
        }
      }
    }
  }
}

export function fetchQuizAnswer({ quizId, answererId }) {
  return {
    type: FETCH_QUIZ_ANSWER,
    payload: {
      request: {
        url: `/quizzes/${quizId}/answers/${answererId}?limit=1`,
        method: 'GET'
      }
    }
  }
}

export function updateQuizAnswer({ quizId, data }) {
  return {
    type: UPDATE_QUIZ_ANSWER,
    quizId,
    data
  }
}
