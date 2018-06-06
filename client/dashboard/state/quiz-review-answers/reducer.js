import { 
  FETCH_REVIEW_ANSWERS, 
  FETCH_REVIEW_ANSWERS_SUCCESS,
  UPDATE_REVIEW_CONFIRMATION,
  UPDATE_REVIEW_REJECTION
} from './actions'
import { createReducer } from 'redux-create-reducer';

const initialState = {
  loading: true,
  statuses: []
}

export default createReducer(initialState, {
  [FETCH_REVIEW_ANSWERS](state, action) {
    return Object.assign({}, state, { loading: true })
  },
  [FETCH_REVIEW_ANSWERS_SUCCESS](state, action) {
    const { payload: { data } } = action
    console.log(action)
    return Object.assign({}, state, { 
      loading: false,
      statuses: data
    })
  },
  [UPDATE_REVIEW_CONFIRMATION](state, action) {
    const { payload: { data } } = action

    console.log(action)

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
  [UPDATE_REVIEW_REJECTION](state, action) {
    const { payload: { data } } = action

    console.log(action)
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
  }
})