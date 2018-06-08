import { 
  FETCH_QUIZ_REVIEW_ANSWERS, 
  FETCH_QUIZ_REVIEW_ANSWERS_SUCCESS,
  UPDATE_QUIZ_REVIEW_ANSWER_CONFIRMATION,
  UPDATE_QUIZ_REVIEW_ANSWER_REJECTION,
  UPDATE_QUIZ_REVIEW_ANSWER_STATUS,
  UPDATE_QUIZ_REVIEW_ANSWER_STATUS_SUCCESS
} from './actions'
import { createReducer } from 'redux-create-reducer';

const initialState = {
  loading: true,
  statuses: []
}

export default createReducer(initialState, {
  [FETCH_QUIZ_REVIEW_ANSWERS](state, action) {
    return Object.assign({}, state, { loading: true })
  },
  [FETCH_QUIZ_REVIEW_ANSWERS_SUCCESS](state, action) {
    const { payload: { data } } = action

    return Object.assign({}, state, { 
      loading: false,
      statuses: data
    })
  },
  [UPDATE_QUIZ_REVIEW_ANSWER_CONFIRMATION](state, action) {
    const { payload: { data } } = action

    const { statuses } = state

    const newStatuses = statuses.map(status => {
      if (status.answerId !== data.answerId) {
        return status
      }

      const statusAnswer = Object.assign({}, status.answer, { confirmed: data.confirmed })

      return Object.assign({}, status, { answer: statusAnswer })
    })

    return Object.assign({}, state, {
      loading: false,
      statuses: newStatuses
    })
  },
  [UPDATE_QUIZ_REVIEW_ANSWER_REJECTION](state, action) {
    const { payload: { data } } = action

    const { statuses } = state

    const newStatuses = statuses.map(status => {
      if (status.answerId !== data.answerId) {
        return status
      }

      const statusAnswer = Object.assign({}, status.answer, { rejected: data.rejected })

      return Object.assign({}, status, { answer: statusAnswer })
    })

    return Object.assign({}, state, {
      loading: false,
      statuses: newStatuses
    })
  },
  [UPDATE_QUIZ_REVIEW_ANSWER_STATUS](state, action) {
    return state
  },
  [UPDATE_QUIZ_REVIEW_ANSWER_STATUS_SUCCESS](state, action) {
    const { payload: { data } } = action
    const { statuses } = state

    const newStatuses = statuses.map(status => {
      if (status.answerId !== data.answerId) {
        return status
      }

      const newStatus = {
        pass: data.status.pass || false,
        review: data.status.review || false,
        rejected: data.status.rejected || false,
        reason: data.status.reason
      }

      return Object.assign({}, status, { status: newStatus })
    })

    return Object.assign({}, state, {
      loading: false,
      statuses: newStatuses
    })
  }
})