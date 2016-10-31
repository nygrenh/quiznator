import { combineReducers } from 'redux';

import quizzes from './quizzes';
import quizAnswers from './quiz-answers';
import quizAlerts from './quiz-alerts';
import user from './user';
import peerReviews from './peer-reviews';
import peerReviewsReceived from './peer-reviews-received';
import dashboard from './dashboard';

export default combineReducers({
  quizzes,
  quizAnswers,
  quizAlerts,
  user,
  peerReviews,
  peerReviewsReceived,
  dashboard
});
