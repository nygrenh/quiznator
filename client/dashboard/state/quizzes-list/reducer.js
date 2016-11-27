import { createReducer } from 'redux-create-reducer';
import { LOCATION_CHANGE } from 'react-router-redux';

import { FETCH_QUIZZES_LIST, FETCH_QUIZZES_LIST_SUCCESS, SET_PAGE } from './actions';

const initialState = {
  loading: true,
  error: false,
  data: {},
  currentPage: 1,
  pageSize: 20
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
  },
  [LOCATION_CHANGE](state, action) {
    const { payload: { query } } = action;

    const page = +(query.page || 1);

    return Object.assign({}, state, { currentPage: page });
  }
});
