import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import expect from 'expect';
import axiosMiddleware from 'utils/axios-middleware';

import * as actions from '../actions';
import * as peerReviewActions from 'state/peer-reviews';
import * as quizAnswersActions from 'state/quiz-answers';
import { PEER_REVIEW, MULTIPLE_CHOICE } from 'common-constants/quiz-types';

const middlewares = [thunk, axiosMiddleware];
const mockStore = configureMockStore(middlewares);

describe('Quizzes actions', () => {

  it('should create a peer review when submitting a peer review typed quiz', () => {
    const store = mockStore({
      user: {
        id: '1'
      },
      quizzes: {
        '1': {
          data: {
            type: PEER_REVIEW,
            data: {
              quizId: '2'
            }
          }
        }
      },
      quizAnswers: {
        '1': {
          data: {}
        }
      }
    });

    store.dispatch(actions.submitQuiz('1'));

    const performedActions = store.getActions();

    expect(performedActions[0].type).toEqual(actions.SET_QUIZ_AS_SUBMITTED);
    expect(performedActions[1].type).toEqual(peerReviewActions.POST_PEER_REVIEWS);
  });

  it('should create a quiz answer when submitting an answerable quiz', () => {
    const store = mockStore({
      user: {
        id: '1'
      },
      quizzes: {
        '1': {
          data: {
            type: MULTIPLE_CHOICE,
            data: {}
          }
        }
      },
      quizAnswers: {
        '1': {
          data: {}
        }
      }
    });

    store.dispatch(actions.submitQuiz('1'));

    const performedActions = store.getActions();

    expect(performedActions[0].type).toEqual(actions.SET_QUIZ_AS_SUBMITTED);
    expect(performedActions[1].type).toEqual(quizAnswersActions.POST_QUIZ_ANSWER);
  });

});
