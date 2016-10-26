import { createSelector } from 'reselect';

import { selectQuizAnswers } from 'selectors/quiz-answers';

export const selectQuizzes = state => state.quizzes;

export const selectQuizzesWithAnswersAsArray = createSelector(
  selectQuizzes,
  selectQuizAnswers,
  (quizzes, answers) => {
    return Object.keys(quizzes).map(id => Object.assign({}, quizzes[id], { answer: answers[id] || {} }));
  }
);
