import { createReducer } from 'redux-create-reducer';
import { normalize } from 'normalizr';
import scour from 'scourjs';

import quizSchema from 'schemas/quiz';

import { FETCH_QUIZ, FETCH_QUIZ_SUCCESS, UPDATE_QUIZ, ADD_DATA_ITEM, UPDATE_DATA_ITEM, REMOVE_DATA_ITEM, UPDATE_DATA, UPDATE_DATA_META, SET_DATA_META_PATH } from './actions';

export default createReducer({}, {
  [FETCH_QUIZ](state, action) {
    return scour(state)
      .go('meta', 'quizzes', action.quizId)
      .extend({ loading: true })
      .root
      .value;
  },
  [UPDATE_QUIZ](state, action) {
    const scourState = scour(state);

    return scourState
      .go('entities', 'quizzes', action.quizId)
      .extend(action.update)
      .root
      .value;
  },
  [FETCH_QUIZ_SUCCESS](state, action) {
    const newQuiz = normalize(action.payload.data, quizSchema);
    const quizId = newQuiz.result;

    let newState = scour(state)
      .go('entities', 'quizzes')
      .extend(newQuiz.entities.quizzes)
      .root
      .go('meta', 'quizzes', quizId)
      .extend({ loading: false, fetchedAt: +(new Date()) })
      .root;

    if(newQuiz.entities.items) {
      newState = newState
        .go('entities', 'items')
        .extend(newQuiz.entities.items)
        .root;
    }

    return newState.value;
  },
  [UPDATE_DATA](state, action) {
    return scour(state)
      .go('entities', 'quizzes', action.quizId, 'data')
      .extend(action.update)
      .root
      .value;
  },
  [ADD_DATA_ITEM](state, action) {
    const scourState = scour(state);

    const items = scourState.get('entities', 'quizzes', action.quizId, 'data', 'items') || [];

    return scourState
      .set(['entities', 'items', action.itemId], action.item)
      .set(['entities', 'quizzes', action.quizId, 'data', 'items'], [...items, action.itemId])
      .value;
  },
  [UPDATE_DATA_ITEM](state, action) {
    return scour(state)
      .go('entities', 'items', action.itemId)
      .extend(action.update)
      .root
      .value;
  },
  [REMOVE_DATA_ITEM](state, action) {
    const scourState = scour(state);

    const quizId = scourState.get('result');
    const items = scourState.get('entities', 'quizzes', action.quizId, 'data', 'items') || [];

    return scourState
      .set(['entities', 'quizzes', action.quizId, 'data', 'items'], [...items.filter(id => id !== action.itemId)])
      .del(['entities', 'items', action.itemId])
      .value;
  },
  [UPDATE_DATA_META](state, action) {
    return scour(state)
      .go('entities', 'quizzes', action.quizId, 'data', 'meta')
      .extend(action.update)
      .root
      .value;
  },
  [SET_DATA_META_PATH](state, action) {
    return scour(state)
      .set(['entities', 'quizzes', action.quizId, 'data', 'meta', ...action.path], action.value)
      .value;
  }
});
