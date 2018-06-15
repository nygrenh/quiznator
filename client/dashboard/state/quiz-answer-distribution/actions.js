export const FETCH_ANSWER_DISTRIBUTION = 'QUIZ_FETCH_ANSWER_DISTRIBUTION'
export const FETCH_ANSWER_DISTRIBUTION_SUCCESS = 'QUIZ_FETCH_ANSWER_DISTRIBUTION_SUCCESS'
export const UPDATE_COURSE_STATE_ANSWER_STATUS = 'UPDATE_COURSE_STATE_ANSWER_STATUS'
export const UPDATE_COURSE_STATE_ANSWER_STATUS_SUCCESS = 'UPDATE_COURSE_STATE_ANSWER_STATUS_SUCCESS'

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

export function updateCourseStateAnswerStatus({ answerId, courseId, answererId, confirmed, rejected }) {
  return (dispatch) => {
    return dispatch(updateCourseStateAnswerStatusRequest({ answerId, courseId, answererID, confirmed, rejected }))
  }
}

export function updateCourseStateAnswerStatusRequest({ answerId, courseId, answererId, confirmed, rejected }) {
  return {
    type: UPDATE_COURSE_STATE_ANSWER_STATUS,
    payload: {
      request: {
        method: 'POST',
        url: '/course-state/stateanswer',
        data: {
          answerId,
          courseId,
          answererId,
          confirmed,
          rejected
        }
      }
    }
  }
}
