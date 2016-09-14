import QuizzesListPage from './quizzes-list-page';
import QuizPage from './quiz-page';
import EditQuizPage from './quiz-page/edit-quiz-page';

const routes = {
  path: 'quizzes',
  indexRoute: {
    component: QuizzesListPage
  },
  childRoutes: [{
    path: ':id',
    component: QuizPage,
    indexRoute: {
      component: EditQuizPage
    }
  }]
};

export default routes;
