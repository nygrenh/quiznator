export const FETCH_REVIEW_ANSWERS = 'QUIZ_REVIEW_ANSWERS_FETCH'
export const FETCH_REVIEW_ANSWERS_SUCCESS = 'QUIZ_REVIEW_ANSWERS_FETCH_SUCCESS'

export function fetchQuizReviewAnswers(quizId, options) {
  return (dispatch, getState) => {
    return dispatch(fetchQuizReviewAnswersRequest({ quizId, options }))   
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

