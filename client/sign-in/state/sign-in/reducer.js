import { createReducer } from 'redux-create-reducer';

import { POST_SIGN_IN, POST_SIGN_IN_FAIL } from './actions';

export default createReducer({}, {
  [POST_SIGN_IN](state, action) {
    return Object.assign({}, state, { error: false });
  },
  [POST_SIGN_IN_FAIL](state, action) {
    return Object.assign({}, state, { error: true });
  }
});
