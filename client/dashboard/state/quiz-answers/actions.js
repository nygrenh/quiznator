export const FETCH_QUIZ_ANSWERS = 'QUIZ_ANSWERS_FETCH_QUIZ_ANSWERS';
export const FETCH_QUIZ_ANSWERS_SUCCESS = 'QUIZ_ANSWERS_FETCH_QUIZ_ANSWERS_SUCCESS';
export const UPDATE_QUIZ_ANSWER_CONFIRMATION = 'QUIZ_ANSWERS_UPDATE_QUIZ_ANSWER_CONFIRMATION';
export const UPDATE_QUIZ_ANSWER_CONFIRMATION_SUCCESS = 'QUIZ_ANSWERS_UPDATE_QUIZ_ANSWER_CONFIRMATION_SUCCESS';
export const UPDATE_QUIZ_ANSWER_REJECTION = 'QUIZ_ANSWERS_UPDATE_QUIZ_ANSWER_REJECTION';
export const UPDATE_QUIZ_ANSWER_REJECTION_SUCCESS = 'QUIZ_ANSWERS_UPDATE_QUIZ_ANSWER_REJECTION_SUCCESS';

export function fetchQuizAnswers(quizId) {
  return (dispatch, getState) => {
    const { quizAnswers: { filters: { dateTo } } } = getState();

    return dispatch(fetchQuizAnswersRequest({ quizId, dateTo }));
  }
}

export function updateConfirmation({ answerId, confirmed }) {
  return {
    type: UPDATE_QUIZ_ANSWER_CONFIRMATION,
    payload: {
      request: {
        method: 'PUT',
        url: `/quiz-answers/${answerId}/confirmed`,
        data: {
          confirmed,
        }
      },
    },
  };
}

export function updateRejection({ answerId, rejected }) {
  return {
    type: UPDATE_QUIZ_ANSWER_REJECTION,
    payload: {
      request: {
        method: 'PUT',
        url: `/quiz-answers/${answerId}/rejected`,
        data: {
          rejected,
        }
      },
    },
  };
}

export function fetchQuizAnswersRequest({ quizId, dateTo }) {
  const query = `quizId=${quizId}` + (dateTo ? `&dateTo=${dateTo}` : '');

  return {
    type: FETCH_QUIZ_ANSWERS,
    payload: {
      request: {
        url: `/answerers?${query}`
      }
    }
  };
}