import { createReducer } from 'redux-create-reducer';

import { CHOOSE_QUIZ_TYPE, SET_MODAL_DISPLAY } from './actions';

export default createReducer({}, {
  [SET_MODAL_DISPLAY](state, action) {
    return Object.assign({}, state, { modalIsOpen: action.isOpen });
  },
  [CHOOSE_QUIZ_TYPE](state, action) {
    return Object.assign({}, state, { quizType: action.quizType });
  }
});
