import { createReducer } from 'redux-create-reducer';

import { FETCH_QUIZZES_LIST, FETCH_QUIZZES_LIST_SUCCESS } from './actions';

export default createReducer({}, {
  [FETCH_QUIZZES_LIST](state, action) {
    return Object.assign({}, state, { loading: true });
  },
  [FETCH_QUIZZES_LIST_SUCCESS](state, action) {
    return Object.assign({}, state, { loading: false, data: action.payload.data });
  }
});
