import QuizzesListPage from './quizzes-list-page';
import QuizPage from './quiz-page';

const routes = {
  path: 'quizzes',
  indexRoute: {
    component: QuizzesListPage
  },
  childRoutes: [{
    path: ':id',
    component: QuizPage
  }]
};

export default routes;
