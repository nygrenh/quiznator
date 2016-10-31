import { createReducer } from 'redux-create-reducer';

import { OPEN_DASHBOARD, CLOSE_DASHBOARD } from './actions';

const initialState = {
  isOpen: false
};

export default createReducer(initialState, {
  [OPEN_DASHBOARD](state, action) {
    return Object.assign({}, state, { isOpen: true });
  },
  [CLOSE_DASHBOARD](state, action) {
    return Object.assign({}, state, { isOpen: false });
  }
});
