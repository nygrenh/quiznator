export const FETCH_REVIEW_ANSWERS = 'QUIZ_REVIEW_ANSWERS_FETCH'
export const FETCH_REVIEW_ANSWERS_SUCCESS = 'QUIZ_REVIEW_ANSWERS_FETCH_SUCCESS'
export const UPDATE_REVIEW_CONFIRMATION = 'UPDATE_REVIEW_CONFIRMATION'
export const UPDATE_REVIEW_REJECTION = 'UPDATE_REVIEW_REJECTION'

export function fetchQuizReviewAnswers(quizId, options) {
  return (dispatch, getState) => {
    return dispatch(fetchQuizReviewAnswersRequest({ quizId, options }))   
  }
}

export function updateReviewConfirmation({ answerId, confirmed }) {
  return {
    type: UPDATE_REVIEW_CONFIRMATION,
    payload: {
      data: {
        answerId,
        confirmed
      }
    }
  }
}

export function updateReviewRejection({ answerId, rejected }) {
  return {
    type: UPDATE_REVIEW_REJECTION,
    payload: {
      data: {
        answerId,
        rejected
      }
    }
  }
}

export function fetchQuizReviewAnswersRequest({ quizId, options }) {
  return {
    type: FETCH_REVIEW_ANSWERS,
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



