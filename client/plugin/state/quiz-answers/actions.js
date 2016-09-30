import _get from 'lodash.get';

import { createTemporalAlert } from 'state/quiz-alerts';
import { PEER_REVIEW, PEER_REVIEWS_RECEIVED } from 'common-constants/quiz-types';

export const REMOVE_QUIZ_ANSWERS = 'QUIZ_ANSWERS::REMOVE_QUIZ_ANSWERS';
export const SET_QUIZ_ANSWER_DATA_PATH = 'QUIZ_ANSWERS::SET_QUIZ_ANSWERS_DATA_PATH';
export const POST_QUIZ_ANSWER = 'QUIZ_ANSWERS::POST_QUIZ_ANSWER';
export const POST_QUIZ_ANSWER_SUCCESS = 'QUIZ_ANSWERS::POST_QUIZ_ANSWER_SUCCESS';
export const POST_QUIZ_ANSWER_FAIL = 'QUIZ_ANSWERS::POST_QUIZ_ANSWER_FAIL';
export const FETCH_QUIZ_ANSWER = 'QUIZ_ANSWERS::FETCH_QUIZ_ANSWER';
export const FETCH_QUIZ_ANSWER_SUCCESS = 'QUIZ_ANSWERS::FETCH_QUIZ_ANSWER_SUCCESS';

function validateAnswerData(data, quiz) {
  const rightAnswer = _get(quiz, 'data.meta.rightAnswer');

  const isRightAnswer = typeof rightAnswer === 'object'
    ? rightAnswer.indexOf(data) >= 0
    : data !== rightAnswer;

  if(rightAnswer && !isRightAnswer) {
    return _get(quiz, `data.meta.errors.${data}`) || 'Wrong answer';
  }
}

export function createQuizAnswer({ quizId, data }) {
  return (dispatch, getState) => {
    const { user, quizzes } = getState();

    const quiz = quizzes[quizId].data;
    const hasRightAnswer = !!_get(quiz, 'data.meta.rightAnswer');

    if(!user.id || !quiz) {
      return Promise.resolve();
    }

    const errorMessage = validateAnswerData(data, quiz);
    const successMessage = _get(quiz, `data.meta.successes.${data}`) || 'Right answer';

    if(hasRightAnswer && errorMessage) {
      dispatch(createTemporalAlert({ content: errorMessage, quizId, type: 'danger', removeDelay: 15000 }));
    } else if(hasRightAnswer && !errorMessage) {
      dispatch(createTemporalAlert({ content: successMessage, quizId, type: 'success', removeDelay: 15000 }));
    }

    return dispatch(createQuizAnswerRequest({ quizId, data }));
  }
}

export function removeQuizAnswers() {
  return {
    type: REMOVE_QUIZ_ANSWERS
  }
}

export function getQuizAnswer({ quizId }) {
  return (dispatch, getState) => {
    const { user, quizzes } = getState();

    const quiz = quizzes[quizId].data;

    if(quiz && user.id && ![PEER_REVIEW, PEER_REVIEWS_RECEIVED].includes(quiz.type)) {
      return dispatch(fetchQuizAnswer({ quizId, answererId: user.id }));
    } else {
      return Promise.resolve();
    }
  }
}

export function createQuizAnswerRequest({ quizId, data }) {
  return {
    type: POST_QUIZ_ANSWER,
    quizId,
    payload: {
      request: {
        url: `/quizzes/${quizId}/answers`,
        method: 'POST',
        data: {
          data
        }
      }
    }
  }
}

export function fetchQuizAnswer({ quizId, answererId }) {
  return {
    type: FETCH_QUIZ_ANSWER,
    quizId,
    answererId,
    payload: {
      request: {
        url: `/quizzes/${quizId}/answers/${answererId}?limit=1`,
        method: 'GET'
      }
    }
  }
}

export function setQuizAnswerDataPath(quizId, path, value) {
  return {
    type: SET_QUIZ_ANSWER_DATA_PATH,
    quizId,
    path,
    value
  }
}
