import { 
  FETCH_ANSWER_DISTRIBUTION, FETCH_ANSWER_DISTRIBUTION_SUCCESS,
  UPDATE_COURSE_STATE_ANSWER_STATUS, UPDATE_COURSE_STATE_ANSWER_STATUS_SUCCESS
} from './actions'
import { createReducer } from 'redux-create-reducer'

const initialState = {
  loading: true,
  answers: []
}

export default createReducer(initialState, {
  [FETCH_ANSWER_DISTRIBUTION](state, action) {
    return Object.assign({}, state, { loading: true })
  },
  [FETCH_ANSWER_DISTRIBUTION_SUCCESS](state, action) {
    const { payload: { data } } = action

    return Object.assign({}, state, {
      loading: false,
      answers: data
    })
  },
  [UPDATE_COURSE_STATE_ANSWER_STATUS](state, action) {
    return state
  },
  [UPDATE_COURSE_STATE_ANSWER_STATUS_SUCCESS](state, action) {
    const { payload: { data } } = action

    let newAnswers = []

    if (data && data.completion && data.completion.data && data.completion.data.answerValidation) {
      newAnswers = data.completion.data.answerValidation
    }
    return Object.assign({}, state, {
      loading: false,
      answers: newAnswers
    })
  }
})