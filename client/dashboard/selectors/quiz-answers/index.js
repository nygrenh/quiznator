export const selectQuizAnswers = state => {
  return state.quizAnswers.answersOrder.map(id => state.quizAnswers.answers[id]);
}