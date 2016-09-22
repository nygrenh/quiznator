import quizRoutes from './routes/quiz';

import Quizzes from './pages/quizzes';

const routes = {
  path: 'quizzes',
  indexRoute: {
    component: Quizzes
  },
  childRoutes: [
    quizRoutes
  ]
};

export default routes;
