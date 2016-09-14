import 'babel-polyfill';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Inview from 'react-inview';

import QuizLoader from 'components/quiz-loader';
import store from 'state/store';

import syncQuiznatorWithStore from 'utils/sync-quiznator-with-store';

window.Quiznator = syncQuiznatorWithStore(store);

document.querySelectorAll('.quiznator-plugin')
  .forEach(quiz => {
    render(
      <Provider store={store}>
        <Inview onInview={() => {}}>
          <QuizLoader id={quiz.getAttribute('quiz-id')}/>
        </Inview>
      </Provider>,
      quiz
    );
  });
