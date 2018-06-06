import { FETCH_ANSWER_DISTRIBUTION, FETCH_ANSWER_DISTRIBUTION_SUCCESS } from './actions'
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
  }
})