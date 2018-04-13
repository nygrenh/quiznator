import _get from 'lodash.get';

import axios from 'utils/axios-client';
import { subscribe, publish } from 'utils/pubsub';
import { setUser, removeUser } from 'state/user';
import { refreshPrivacyAgreement } from 'state/privacy-agreement'
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

  self.refreshAgreement = (agreement) => {
    if (!agreement || !agreement.userId || !agreement.quizId) {
      throw new Error('quiz and user ids required for agreement!');
    } else {
      store.dispatch(refreshPrivacyAgreement(agreement));
    }

    return self;
  }

  return self;
}

export default syncQuiznatorWithStore;
