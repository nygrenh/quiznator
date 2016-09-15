import { createReducer } from 'redux-create-reducer';

import { SET_PUBLISH_QUIZ_MODAL_DISPLAY, SET_QUIZ_TO_PUBLISH } from './actions';

export default createReducer({}, {
  [SET_PUBLISH_QUIZ_MODAL_DISPLAY](state, action) {
    return Object.assign({}, state, { modalIsOpen: action.isOpen });
  },
  [SET_QUIZ_TO_PUBLISH](state, action) {
    return Object.assign({}, state, { quiz: action.quiz });
  }
});
