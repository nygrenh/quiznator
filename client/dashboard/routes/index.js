import React from 'react';
import { Route, Router, IndexRoute } from 'react-router';

import Dashboard from './dashboard';
import Home from './dashboard/home';
import Quizzes from './quizzes';
import Quiz from './quizzes/quiz';
import EditQuiz from './quizzes/quiz/edit-quiz';
import QuizSettings from './quizzes/quiz/quiz-settings';
import QuizAnswers from './quizzes/quiz/quiz-answers';
import QuizReviewAnswers from './quizzes/quiz/quiz-review-answers'
import QuizAnswerDistribution from './quizzes/quiz/quiz-answer-distribution'

const routes = (
  <Route path="/dashboard" component={Dashboard}>
    <IndexRoute component={Home} />
    <Route path="quizzes">
      <IndexRoute component={Quizzes} />
      <Route path=":id" component={Quiz}>
        <Route path="edit" component={EditQuiz} />
        <Route path="settings" component={QuizSettings}/>
        <Route path="answers" component={QuizAnswers}/>
        <Route path="review-answers" component={QuizReviewAnswers}/>
        <Route path="answer-distribution" component={QuizAnswerDistribution}/>
      </Route>
    </Route>
  </Route>
);

export default routes;
