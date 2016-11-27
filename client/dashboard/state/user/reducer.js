import { createReducer } from 'redux-create-reducer';

import { FETCH_PROFILE_SUCCESS, FETCH_TAGS_SUCCESS } from './actions';

const initialState = {
  tags: []
};

export default createReducer(initialState, {
  [FETCH_PROFILE_SUCCESS](state, action) {
    return Object.assign({}, state, action.payload.data || {});
  },
  [FETCH_TAGS_SUCCESS](state, action) {
    const tags = action.payload.data;

    return Object.assign({}, state, { tags });
  }
});
