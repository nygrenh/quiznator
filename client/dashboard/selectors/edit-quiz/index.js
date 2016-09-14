import get from 'lodash.get';
import { createSelector } from 'reselect'

export const quizSelector = state => {
  return state.editQuiz.result
    ? state.editQuiz.entities.quizzes[state.editQuiz.result]
    : undefined;
}

export const itemsSelector = state => {
  return (state.editQuiz.entities || {}).items;
}

export const quizItemsSelector = createSelector(
  quizSelector,
  itemsSelector,
  (quiz, items) => {
    if(!get(quiz, 'data.items')) {
      return undefined;
    } else {
      return quiz.data.items.map(id => items[id]);
    }
  }
);
