export const FETCH_ANSWER_DISTRIBUTION = 'QUIZ_FETCH_ANSWER_DISTRIBUTION'
export const FETCH_ANSWER_DISTRIBUTION_SUCCESS = 'QUIZ_FETCH_ANSWER_DISTRIBUTION_SUCCESS'

export function fetchQuizAnswerDistribution(quizId, options) {
  return (dispatch) => {
    return dispatch(fetchQuizAnswerDistributionRequest({ quizId, options }))
  }
}

export function fetchQuizAnswerDistributionRequest({ quizId, options }) {
  return {
    type: FETCH_ANSWER_DISTRIBUTION,
    payload: {
      request: {
        method: 'POST',
        url: '/course-state/distribution',
        data: {
          quizId,
          options
        }
      }
    }
  }
}