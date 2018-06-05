import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import { routerReducer } from 'react-router-redux'

import user from './user';
import tokens from './tokens';
import quizzesList from './quizzes-list';
import createQuiz from './create-quiz';
import cloneQuizzes from './clone-quizzes';
import quizzesListFilters from './quizzes-list-filters';
import editQuiz from './edit-quiz';
import quizAnswers from './quiz-answers';
import quizReviewAnswers from './quiz-review-answers'
import publishQuiz from './publish-quiz';
import toaster from './toaster';

export default combineReducers({
  form: formReducer,
  routing: routerReducer,
  user,
  tokens,
  quizzesList,
  quizzesListFilters,
  createQuiz,
  cloneQuizzes,
  editQuiz,
  quizAnswers,
  quizReviewAnswers,
  publishQuiz,
  toaster
});
