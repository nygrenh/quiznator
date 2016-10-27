import { createSelector } from 'reselect';

import { selectQuizAnswers } from 'selectors/quiz-answers';
import { answerableTypes } from 'common-constants/quiz-types';

export const selectQuizzes = state => state.quizzes;

export const selectAnswerableQuizzesWithAnswersAsArray = createSelector(
  selectQuizzes,
  selectQuizAnswers,
  (quizzes, answers) => {
    return Object.keys(quizzes)
      .map(id => Object.assign({}, quizzes[id], { answer: answers[id] || {} }))
      .filter(quiz => quiz.data && answerableTypes.indexOf(quiz.data.type) >= 0);
  }
);

export const selectAnsweredQuizzes = createSelector(
  selectQuizzes,
  selectQuizAnswers,
  (quizzes, answers) => {
    return Object.keys(answers)
      .filter(id => !!answers[id].data)
      .map(id => quizzes[id]);
  }
);

export const selectAnsweredQuizzesCount = createSelector(
  selectAnsweredQuizzes,
  quizzes => quizzes.length
);

export const selectAnswerableQuizzesCount = createSelector(
  selectAnswerableQuizzesWithAnswersAsArray,
  quizzes => quizzes.length
);
