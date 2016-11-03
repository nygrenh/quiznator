import scour from 'scourjs';

import { createReducer } from 'redux-create-reducer';

import { FETCH_SPAM_FLAG_SUCCESS, REMOVE_SPAM_FLAG, CREATE_SPAM_FLAG } from './actions';

export default createReducer({}, {
  [FETCH_SPAM_FLAG_SUCCESS](state, action) {
    const answerId = action.meta.previousAction.answerId;
    const data = action.payload.data;

    return Object.assign({}, state, { [answerId]: data });
  },
  [REMOVE_SPAM_FLAG](state, action) {
    return scour(state)
      .go(action.answerId)
      .extend({ flag: 0 })
      .root
      .value;
  },
  [CREATE_SPAM_FLAG](state, action) {
    return scour(state)
      .go(action.answerId)
      .extend({ flag: 1 })
      .root
      .value;
  }
});
