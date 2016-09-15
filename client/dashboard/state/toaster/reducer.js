import scour from 'scourjs';
import { createReducer } from 'redux-create-reducer';

import { ADD_TOAST, REMOVE_TOAST } from './actions';

const initialState = {
  toastOrder: [],
  toasts: {}
}

export default createReducer(initialState, {
  [ADD_TOAST](state, action) {
    const { toastType, content, id } = action;

    return scour(state)
      .set(['toastOrder'], [id, ...state.toastOrder])
      .set(['toasts', id], { type: toastType, content, id })
      .value;
  },
  [REMOVE_TOAST](state, action) {
    const newToastOrder = [...state.toastOrder.filter(id => id !== action.id)];

    return scour(state)
      .set(['toastOrder'], newToastOrder)
      .del(['toasts', action.id])
      .value;
  }
});
