try {
  require('babel-polyfill');
} catch(e) {}

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import LazyLoad from 'react-lazyload';

import QuizLoader from 'components/quiz-loader';
import store from 'state/store';

import syncQuiznatorWithStore from 'utils/sync-quiznator-with-store';

window.Quiznator = syncQuiznatorWithStore(store);

document.querySelectorAll('.quiznator-plugin')
  .forEach(quiz => {
    render(
      <Provider store={store}>
        <LazyLoad height={300} once>
          <QuizLoader id={quiz.getAttribute('quiz-id')}/>
        </LazyLoad>
      </Provider>,
      quiz
    );
  });
