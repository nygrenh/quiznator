import React from 'react';

import Dashboard from './dashboard';
import Home from './dashboard/home';
import Quizzes from './quizzes';
import Quiz from './quizzes/quiz';
import EditQuiz from './quizzes/quiz/edit-quiz';
import QuizSettings from './quizzes/quiz/quiz-settings';
import { Route, Router, IndexRoute } from 'react-router';

const routes = (
  <Route path="/dashboard" component={Dashboard}>
    <IndexRoute component={Home}/>
    <Route path="quizzes">
      <IndexRoute component={Quizzes}/>
      <Route path=":id" component={Quiz}>
        <Route path="edit" component={EditQuiz}/>
        <Route path="settings" component={QuizSettings}/>
      </Route>
    </Route>
  </Route>
);

export default routes;
