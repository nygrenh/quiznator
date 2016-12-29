import { createReducer } from 'redux-create-reducer';

import { SET_MODAL_DISPLAY, SET_METHOD, SET_QUIZ, SET_TAGS_FROM, SET_TAGS_TO } from './actions';

const initialState = {
  modalIsOpen: false,
  method: 'quiz',
  quizId: null,
  tagsFrom: null,
  tagsTo: null
};

export default createReducer(initialState, {
  [SET_MODAL_DISPLAY](state, action) {
    return Object.assign({}, state, { modalIsOpen: action.isOpen });
  },
  [SET_METHOD](state, action) {
    return Object.assign({}, state, { method: action.method });
  },
  [SET_QUIZ](state, action) {
    return Object.assign({}, state, { quizId: action.quizId });
  },
  [SET_TAGS_FROM](state, action) {
    return Object.assign({}, state, { tagsFrom: action.tags });
  },
  [SET_TAGS_TO](state, action) {
    return Object.assign({}, state, { tagsTo: action.tags });
  }
});
