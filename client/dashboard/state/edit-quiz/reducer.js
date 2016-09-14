import { createReducer } from 'redux-create-reducer';
import { normalize } from 'normalizr';
import scour from 'scourjs';

import quizSchema from 'schemas/quiz';

import { FETCH_QUIZ, FETCH_QUIZ_SUCCESS, UPDATE_QUIZ, ADD_DATA_ITEM, UPDATE_DATA_ITEM, REMOVE_DATA_ITEM, UPDATE_DATA, UPDATE_DATA_META, SET_DATA_META_PATH } from './actions';

export default createReducer({}, {
  [FETCH_QUIZ](state, action) {
    return Object.assign({}, state, { loading: true });
  },
  [UPDATE_QUIZ](state, action) {
    const scourState = scour(state);

    const quizId = scourState.get('result');

    return scourState
      .go('entities', 'quizzes', quizId)
      .extend(action.update)
      .root
      .value;
  },
  [FETCH_QUIZ_SUCCESS](state, action) {
    return Object.assign({}, state, normalize(action.payload.data, quizSchema), { loading: false });
  },
  [UPDATE_DATA](state, action) {
    const scourState = scour(state);

    const quizId = scourState.get('result');

    return scourState
      .go('entities', 'quizzes', quizId, 'data')
      .extend(action.update)
      .root
      .value;
  },
  [ADD_DATA_ITEM](state, action) {
    const scourState = scour(state);

    const quizId = scourState.get('result');
    const items = scourState.get('entities', 'quizzes', quizId, 'data', 'items') || [];

    return scourState
      .set(['entities', 'items', action.itemId], action.item)
      .set(['entities', 'quizzes', quizId, 'data', 'items'], [...items, action.itemId])
      .value;
  },
  [UPDATE_DATA_ITEM](state, action) {
    const scourState = scour(state);

    return scourState
      .go('entities', 'items', action.itemId)
      .extend(action.update)
      .root
      .value;
  },
  [REMOVE_DATA_ITEM](state, action) {
    const scourState = scour(state);

    const quizId = scourState.get('result');
    const items = scourState.get('entities', 'quizzes', quizId, 'data', 'items') || [];

    return scourState
      .set(['entities', 'quizzes', quizId, 'data', 'items'], [...items.filter(id => id !== action.itemId)])
      .del(['entities', 'items', action.itemId])
      .value;
  },
  [UPDATE_DATA_META](state, action) {
    const scourState = scour(state);

    const quizId = scourState.get('result');

    return scourState
      .go('entities', 'quizzes', quizId, 'data', 'meta')
      .extend(action.update)
      .root
      .value;
  },
  [SET_DATA_META_PATH](state, action) {
    const scourState = scour(state);

    const quizId = scourState.get('result');

    return scourState
      .set(['entities', 'quizzes', quizId, 'data', 'meta', ...action.path], action.value)
      .value;
  }
});
