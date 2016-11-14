export const selectQuizAnswers = state => state.quizAnswers;

export const hasAnsweredToQuiz = (state, props = {}) => {
  if(!props.quizId) {
    return false;
  }

  const quiz = state.quizzes[props.quizId];
  const answer = state.quizAnswers[props.quizId];

  return answer && quiz && (quiz.submitted || answer.isOld);
}
