import quizzesRoutes from './dashboard/quizzes/routes';

import HomePage from './dashboard/home-page';
import Dashboard from './dashboard';

const routes = {
  path: '/dashboard',
  component: Dashboard,
  indexRoute: {
    component: HomePage
  },
  childRoutes: [
    quizzesRoutes
  ]
};

export default routes;
