import { createSelector } from 'reselect';

import { selectQuizAnswers } from 'selectors/quiz-answers';
import { answerableTypes, PEER_REVIEW } from 'common-constants/quiz-types';

export const selectQuizzes = state => state.quizzes;

export const selectAnswerableQuizzesWithAnswersAsArray = createSelector(
  selectQuizzes,
  selectQuizAnswers,
  (quizzes, answers) => {
    return Object.keys(quizzes)
      .map(id => Object.assign({}, quizzes[id], { answer: answers[id] || {}, id }))
      .filter(quiz => quiz.data && [...answerableTypes, PEER_REVIEW].includes(quiz.data.type));
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
