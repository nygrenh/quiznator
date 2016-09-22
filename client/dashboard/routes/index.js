import quizRoutes from './dashboard/routes/quizzes';

import Home from './dashboard/pages/home';
import Dashboard from './dashboard/pages/dashboard';

const routes = {
  path: '/dashboard',
  component: Dashboard,
  indexRoute: {
    component: Home
  },
  childRoutes: [
    quizRoutes
  ]
};

export default routes;
