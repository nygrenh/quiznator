import { FETCH_REVIEW_ANSWERS, FETCH_REVIEW_ANSWERS_SUCCESS } from './actions'
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
  }
})