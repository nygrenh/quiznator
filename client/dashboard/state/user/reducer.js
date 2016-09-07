import { createReducer } from 'redux-create-reducer';

import { FETCH_PROFILE_SUCCESS } from './actions';

export default createReducer({}, {
  [FETCH_PROFILE_SUCCESS](state, action) {
    return Object.assign({}, state, action.payload.data || {});
  }
});
