import _get from 'lodash.get';
import { createSelector } from 'reselect'

export const quizSelector = state => {
  const quizId = _get(state.editQuiz, 'result');

  return quizId
    ? _get(state.editQuiz, `entities.quizzes.${quizId}`)
    : undefined;
}

export const itemsSelector = state => {
  return _get(state.editQuiz, 'entities.items');
}

export const quizItemsSelector = createSelector(
  quizSelector,
  itemsSelector,
  (quiz, items) => {
    if(!_get(quiz, 'data.items')) {
      return undefined;
    } else {
      return quiz.data.items.map(id => items[id]);
    }
  }
);
