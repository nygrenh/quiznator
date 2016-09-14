import { createSelector } from 'reselect'

export const targetQuizSelector = state => {
  return state.editQuiz.result
    ? state.editQuiz.entities.quizzes[state.editQuiz.result]
    : undefined;
}
