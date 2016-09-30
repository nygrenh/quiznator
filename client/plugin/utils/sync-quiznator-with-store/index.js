import _get from 'lodash.get';

import { setUser, removeUser } from 'state/user';
import { POST_QUIZ_ANSWER_SUCCESS } from 'state/quiz-answers';

const ON_ANSWER = 'ON_ANSWER';

const nop = () => () => {};

let id = 0;

function syncQuiznatorWithStore(store) {
  const self = {};

  const subscriptions = {};

  const subscribe = (eventName, callback) => {
    if(typeof callback !== 'function') {
      throw new Error('Callback must me a function');
    }

    const subscriptionId = (id++).toString();

    subscriptions[eventName] = Object.assign({}, subscriptions[eventName] || {}, { [subscriptionId]: callback });

    return () => {
      delete subscriptions[eventName][subscriptionId];
    };
  }

  const publish = (eventName, data) => {
    Object.keys(subscriptions[eventName] || {})
      .forEach(key => {
        subscriptions[eventName][key](data);
      });
  }

  self.setUser = user => {
    if(!user || !user.accessToken || !user.id) {
      throw new Error('access token and id is required for user!');
    } else {
      store.dispatch(setUser(user));
    }

    return self;
  }

  self.removeUser = () => {
    store.dispatch(removeUser());

    return self;
  }

  self.onAnswer = (callback) => {
    return subscribe(ON_ANSWER, callback);
  }

  let previousAnswer = store.getState().quizAnswers.meta.latestAnswer;

  store.subscribe(() => {
    const nextAnswer = store.getState().quizAnswers.meta.latestAnswer;

    if(nextAnswer !== previousAnswer && nextAnswer) {
      publish(ON_ANSWER, nextAnswer);
      previousAnswer = nextAnswer;
    }
  });

  return self;
}

export default syncQuiznatorWithStore;
