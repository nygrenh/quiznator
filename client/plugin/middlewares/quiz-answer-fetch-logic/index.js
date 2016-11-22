import { FETCH_QUIZ_ANSWER, FETCH_PEER_REVIEWS_GIVEN } from 'state/quiz-answers';

const quizAnswerFetchLogic = store => next => action => {
  if([FETCH_QUIZ_ANSWER, FETCH_PEER_REVIEWS_GIVEN].includes(action.type)) {
    const { quizAnswers, quizzes } = store.getState();
    const { quizId, answererId } = action;

    const answerIsBeingLoaded = !!quizAnswers[quizId] && quizAnswers[quizId].answererId === answererId;
    const quizIsLoaded = quizzes[quizId] && quizzes[quizId].data;

    if(!answerIsBeingLoaded && quizIsLoaded) {
      return next(action);
    }
  } else {
    return next(action);
  }
}

export default quizAnswerFetchLogic;
