try {
  require('babel-polyfill');
} catch(e) {}

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import LazyLoad from 'react-lazyload';

import Dashboard from 'components/dashboard';
import QuizLoader from 'components/quiz-loader';
import store from 'state/store';

import syncQuiznatorWithStore from 'utils/sync-quiznator-with-store';

window.Quiznator = syncQuiznatorWithStore(store);

Array.from(document.querySelectorAll('.quiznator-plugin'))
  .forEach(quiz => {
    render(
      <Provider store={store}>
        <QuizLoader id={quiz.getAttribute('quiz-id') || quiz.getAttribute('data-quiz-id')}/>
      </Provider>,
      quiz
    );
  });

/*const dashboardContainer = document.getElementById('quiznator-dashboard');

if(dashboardContainer) {
  render(
    <Provider store={store}>
      <Dashboard/>
    </Provider>,
    dashboardContainer
  );
}*/
