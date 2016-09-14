import { createReducer } from 'redux-create-reducer';

import { FETCH_QUIZZES_LIST, FETCH_QUIZZES_LIST_SUCCESS, SET_PAGE } from './actions';

const initialState = {
  loading: true,
  error: false,
  data: {},
  currentPage: 1
}

export default createReducer(initialState, {
  [FETCH_QUIZZES_LIST](state, action) {
    return Object.assign({}, state, { loading: true });
  },
  [FETCH_QUIZZES_LIST_SUCCESS](state, action) {
    return Object.assign({}, state, { loading: false, data: action.payload.data });
  },
  [SET_PAGE](state, action) {
    return Object.assign({}, state, { currentPage: action.page });
  }
});
