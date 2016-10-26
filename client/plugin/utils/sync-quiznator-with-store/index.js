import _get from 'lodash.get';

import axios from 'utils/axios-client';
import { subscribe, publish } from 'utils/pubsub';
import { setUser, removeUser } from 'state/user';
import { POST_QUIZ_ANSWER_SUCCESS } from 'state/quiz-answers';

function syncQuiznatorWithStore(store) {
  const self = {};

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

  self.onAnswer = callback => {
    return subscribe(POST_QUIZ_ANSWER_SUCCESS, action => {
      if(_get(action, 'payload.data')) {
        callback(action.payload.data);
      }
    });
  }

  self.getProgress = () => {
    const { user } = store.getState();

    const quizIds = Array.from(document.querySelectorAll('.quiznator-plugin')).map(el => el.getAttribute('data-quiz-id'));

    if(user && user.accessToken) {
      const request = {
        method: 'POST',
        headers: {
          'authorization': `Bearer ${user.accessToken}`
        },
        data: {
          quizIds
        }
      }

      return axios(`/answerers/progress`, request);
    } else {
      return Promise.reject('User is not set');
    }
  }

  return self;
}

export default syncQuiznatorWithStore;
