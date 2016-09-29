import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import { routerReducer } from 'react-router-redux'

import user from './user';
import tokens from './tokens';
import quizzesList from './quizzes-list';
import createQuiz from './create-quiz';
import editQuiz from './edit-quiz';
import publishQuiz from './publish-quiz';
import toaster from './toaster';

export default combineReducers({
  form: formReducer,
  routing: routerReducer,
  user,
  tokens,
  quizzesList,
  createQuiz,
  editQuiz,
  publishQuiz,
  toaster
});
