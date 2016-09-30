import { createReducer } from 'redux-create-reducer';

import { SET_USER } from './actions';

export default createReducer({}, {
  [SET_USER](state, action) {
    return Object.assign({}, action.user);
  }
});
