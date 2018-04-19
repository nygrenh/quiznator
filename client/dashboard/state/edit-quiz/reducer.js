import { createReducer } from 'redux-create-reducer';
import { normalize } from 'normalizr';
import _get from 'lodash.get';
import scour from 'scourjs';

import quizSchema from 'schemas/quiz';

import { 
  FETCH_QUIZ, FETCH_QUIZ_SUCCESS, UPDATE_QUIZ,
  ADD_DATA_ITEM, UPDATE_DATA_ITEM, REMOVE_DATA_ITEM,
  ADD_DATA_CHOICE, UPDATE_DATA_CHOICE, REMOVE_DATA_CHOICE, 
  UPDATE_DATA, UPDATE_DATA_META, SET_DATA_META_PATH } from './actions';

const initialState = {
  meta: { loading: true }
}

export default createReducer(initialState, {
  [FETCH_QUIZ](state, action) {
    return scour(state)
      .go('meta')
      .extend({ loading: true })
      .root
      .value;
  },
  [UPDATE_QUIZ](state, action) {
    const quizId = _get(state, 'result');

    return scour(state)
      .go('entities', 'quizzes', quizId)
      .extend(action.update)
      .root
      .value;
  },
  [FETCH_QUIZ_SUCCESS](state, action) {
    const newQuiz = normalize(action.payload.data, quizSchema);

    return scour(state)
      .extend(newQuiz)
      .root
      .go('meta')
      .extend({ loading: false })
      .root
      .value;
  },
  [UPDATE_DATA](state, action) {
    const quizId = _get(state, 'result');

    return scour(state)
      .go('entities', 'quizzes', quizId, 'data')
      .extend(action.update)
      .root
      .value;
  },
  [ADD_DATA_ITEM](state, action) {
    const quizId = _get(state, 'result');
    const items = _get(state, `entities.quizzes.${quizId}.data.items`) || [];

    return scour(state)
      .set(['entities', 'items', action.itemId], action.item)
      .set(['entities', 'quizzes', quizId, 'data', 'items'], [...items, action.itemId])
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
    const quizId = _get(state, 'result');
    const items = _get(state, `entities.quizzes.${quizId}.data.items`) || [];

    return scour(state)
      .set(['entities', 'quizzes', quizId, 'data', 'items'], [...items.filter(id => id !== action.itemId)])
      .del(['entities', 'items', action.itemId])
      .value;
  },
  //
  [ADD_DATA_CHOICE](state, action) {
    const quizId = _get(state, 'result');
    const choices = _get(state, `entities.quizzes.${quizId}.data.choices`) || [];

    return scour(state)
      .set(['entities', 'choices', action.choiceId], action.choice)
      .set(['entities', 'quizzes', quizId, 'data', 'choices'], [...choices, action.choiceId])
      .value;
  },
  [UPDATE_DATA_CHOICE](state, action) {
    return scour(state)
      .go('entities', 'choices', action.choiceId)
      .extend(action.update)
      .root
      .value;
  },
  [REMOVE_DATA_CHOICE](state, action) {
    const quizId = _get(state, 'result');
    const choices = _get(state, `entities.quizzes.${quizId}.data.choices`) || [];

    return scour(state)
      .set(['entities', 'quizzes', quizId, 'data', 'choices'], [...items.filter(id => id !== action.choiceId)])
      .del(['entities', 'choices', action.choiceId])
      .value;
  },
  //
  [UPDATE_DATA_META](state, action) {
    const quizId = _get(state, 'result');

    return scour(state)
      .go('entities', 'quizzes', quizId, 'data', 'meta')
      .extend(action.update)
      .root
      .value;
  },
  [SET_DATA_META_PATH](state, action) {
    const quizId = _get(state, 'result');

    return scour(state)
      .set(['entities', 'quizzes', quizId, 'data', 'meta', ...action.path], action.value)
      .value;
  }
});
