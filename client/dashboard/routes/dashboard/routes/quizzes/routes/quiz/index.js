import Quiz from './pages/quiz';
import QuizSettings from './pages/quiz-settings';
import EditQuiz from './pages/edit-quiz';

const routes = {
  path: ':id',
  component: Quiz,
  childRoutes: [
    {
      path: 'edit',
      component: EditQuiz,
    },
    {
      path: 'settings',
      component: QuizSettings
    }
  ]
};

export default routes;
