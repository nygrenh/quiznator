import { FETCH_QUIZ_ANSWER } from 'state/quiz-answers';

const quizAnswerFetchLogic = store => next => action => {
  if(action.type === FETCH_QUIZ_ANSWER) {
    const { quizAnswers, quizzes } = store.getState();
    const { quizId, answererId } = action;

    const answerIsBeingLoaded = quizAnswers[quizId] && quizAnswers[quizId].answererId === answererId;
    const quizIsLoaded = quizzes[quizId] && quizzes[quizId].data;

    if(!answerIsBeingLoaded && quizIsLoaded) {
      next(action);
    }
  } else {
    next(action);
  }
}

export default quizAnswerFetchLogic;
