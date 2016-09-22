import Quizzes from './pages/quizzes';
import Quiz from './pages/quiz';
import EditQuiz from './pages/quiz/edit-quiz';

const routes = {
  path: 'quizzes',
  indexRoute: {
    component: Quizzes
  },
  childRoutes: [{
    path: ':id',
    component: Quiz,
    indexRoute: {
      component: EditQuiz
    }
  }]
};

export default routes;
