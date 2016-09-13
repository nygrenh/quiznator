import { createReducer } from 'redux-create-reducer';

import { SET_EDITING_QUIZ, SET_EDIT_QUIZ_MODAL_DISPLAY, UPDATE_QUIZ } from './actions';

export default createReducer({}, {
  [SET_EDIT_QUIZ_MODAL_DISPLAY](state, action) {
    return Object.assign({}, state, { modalIsOpen: action.isOpen });
  },
  [SET_EDITING_QUIZ](state, action) {
    return Object.assign({}, state, { quiz: action.quiz });
  },
  [UPDATE_QUIZ](state, action) {
    return Object.assign({}, state, { quiz: Object.assign({}, state.quiz || {}, action.update) });
  }
});
