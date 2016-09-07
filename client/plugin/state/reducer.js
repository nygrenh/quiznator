import { combineReducers } from 'redux';

import quizzes from './quizzes';
import quizAnswers from './quiz-answers';
import quizAlerts from './quiz-alerts';
import user from './user';

export default combineReducers({
  quizzes,
  quizAnswers,
  quizAlerts,
  user
});
