import get from 'lodash.get';

import { createReducer } from 'redux-create-reducer';

import { CREATE_ALERT, REMOVE_ALERT } from './actions';

export default createReducer({}, {
  [CREATE_ALERT](state, action) {
    let alerts = state[action.quizId] || [];
    let newAlert = { type: action.alertType, id: action.id, content: action.content };

    return Object.assign({}, state, { [action.quizId]: [newAlert, ...alerts] });
  },
  [REMOVE_ALERT](state, action) {
    let newAlerts = (state[action.quizId] || []).filter(alert => alert.id !== action.id);

    return Object.assign({}, state, { [action.quizId]: [...newAlerts] });
  }
});
