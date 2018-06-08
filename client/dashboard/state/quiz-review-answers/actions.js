export const FETCH_QUIZ_REVIEW_ANSWERS = 'FETCH_QUIZ_REVIEW_ANSWERS'
export const FETCH_QUIZ_REVIEW_ANSWERS_SUCCESS = 'FETCH_QUIZ_REVIEW_ANSWERS_SUCCESS'
export const UPDATE_QUIZ_REVIEW_ANSWER_CONFIRMATION = 'UPDATE_QUIZ_REVIEW_ANSWER_CONFIRMATION'
export const UPDATE_QUIZ_REVIEW_ANSWER_REJECTION = 'UPDATE_QUIZ_REVIEW_ANSWER_REJECTION'
export const UPDATE_QUIZ_REVIEW_ANSWER_STATUS = 'UPDATE_QUIZ_REVIEW_ANSWER_STATUS'
export const UPDATE_QUIZ_REVIEW_ANSWER_STATUS_SUCCESS = 'UPDATE_QUIZ_REVIEW_ANSWER_STATUS_SUCCESS'

export function fetchQuizReviewAnswers(quizId, options) {
  return (dispatch, getState) => {
    return dispatch(fetchQuizReviewAnswersRequest({ quizId, options }))   
  }
}

export function updateQuizReviewAnswerConfirmation({ answerId, confirmed }) {
  return {
    type: UPDATE_QUIZ_REVIEW_ANSWER_CONFIRMATION,
    payload: {
      data: {
        answerId,
        confirmed
      }
    }
  }
}

export function updateQuizReviewAnswerRejection({ answerId, rejected }) {
  return {
    type: UPDATE_QUIZ_REVIEW_ANSWER_REJECTION,
    payload: {
      data: {
        answerId,
        rejected
      }
    }
  }
}

export function updateQuizReviewAnswerStatus({ answerId, status }) {
  return {
    type: UPDATE_QUIZ_REVIEW_ANSWER_STATUS,
    payload: {
      request: {
        method: 'PUT',
        url: `/quiz-review-answers/${answerId}/status`,
        data: {
          status
        }
      }
    }
  }
}

export function fetchQuizReviewAnswersRequest({ quizId, options }) {
  return {
    type: FETCH_QUIZ_REVIEW_ANSWERS,
    payload: {
      request: {
        method: 'POST',
        url: `/quiz-review-answers`,
        data: { 
          quizId,
          options
        }        
      }
    }
  }
}



