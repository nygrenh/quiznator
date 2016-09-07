import { createReducer } from 'redux-create-reducer';

import { UPDATE_TOKENS } from './actions';

export default createReducer({}, {
  [UPDATE_TOKENS](state, action) {
    return Object.assign({}, state, action.update);
  }
});
