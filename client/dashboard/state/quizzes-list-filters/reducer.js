import { createReducer } from 'redux-create-reducer';
import { LOCATION_CHANGE } from 'react-router-redux';
import scour from 'scourjs';

import { SET_TAGS, OPEN_MODAL, CLOSE_MODAL } from './actions';

const initialState = {
  tags: null,
  modalIsOpen: false
};

export default createReducer(initialState, {
  [LOCATION_CHANGE](state, action) {
    const { payload: { query } } = action;

    const tags = decodeURIComponent(query.tags || '')
      .split(',')
      .filter(tag => !!tag);

    return Object.assign({}, state, { tags: tags.length > 0 ? tags : null });
  },
  [SET_TAGS](state, action) {
    const { tags } = action;

    return Object.assign({}, state, { tags: tags && tags.length > 0 ? tags : null });
  },
  [OPEN_MODAL](state, action) {
    return Object.assign({}, state, { modalIsOpen: true });
  },
  [CLOSE_MODAL](state, action) {
    return Object.assign({}, state, { modalIsOpen: false });
  }
});
