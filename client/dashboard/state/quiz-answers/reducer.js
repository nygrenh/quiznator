import { createReducer } from 'redux-create-reducer';
import { LOCATION_CHANGE } from 'react-router-redux';
import zipObject from 'lodash/zipObject';
import scour from 'scourjs';

import { 
  FETCH_QUIZ_ANSWERS, 
  FETCH_QUIZ_ANSWERS_SUCCESS, 
  UPDATE_QUIZ_ANSWER_CONFIRMATION_SUCCESS,
  UPDATE_QUIZ_ANSWER_REJECTION_SUCCESS,
} from './actions';

const initialState = {
  loading: true,
  error: false,
  filters: {
    dateTo: null
  },
  answers: {},
  answersOrder: [],
}

export default createReducer(initialState, {
  [FETCH_QUIZ_ANSWERS](state, action) {
    return Object.assign({}, state, { loading: true });
  },
  [FETCH_QUIZ_ANSWERS_SUCCESS](state, action) {
    const { payload: { data } } = action;

    const answerIds = data.map(answer => answer.answerId);

    return Object.assign({}, state, { loading: false, answers: zipObject(answerIds, data), answersOrder: answerIds });
  },
  [UPDATE_QUIZ_ANSWER_CONFIRMATION_SUCCESS](state, action) {
    const updatedAnswer = action.payload.data;

    return scour(state)
      .go('answers', updatedAnswer._id)
      .extend(updatedAnswer)
      .root
      .value;
  },
  [UPDATE_QUIZ_ANSWER_REJECTION_SUCCESS](state, action) {
    const updatedAnswer = action.payload.data;

    return scour(state)
      .go('answers', updatedAnswer._id)
      .extend(updatedAnswer)
      .root
      .value;
  },
  [LOCATION_CHANGE](state, action) {
    const { payload: { query } } = action;

    const dateTo = query.dateTo || null;

    return Object.assign({}, state, { filters: Object.assign({}, state.filters, { dateTo }) });
  }
});