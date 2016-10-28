import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import expect from 'expect';

import * as actions from '../actions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Peer review actions', () => {

  it('loadPeerReviews should return a function', () => {
    expect(actions.loadPeerReviews('1')).toBeA(Function);
  });

  it('loadPeerReviews should not dispatch an action if user.id is not defined', () => {
    const getState = () => ({ user: {} });
    const dispatch = expect.createSpy();

    actions.loadPeerReviews('1')(dispatch, getState);

    expect(dispatch).toNotHaveBeenCalled();
  });

  it('loadPeerReviews should dispatch an action if user.id is defined', () => {
    const store = mockStore({ user: { id: '1' } });

    store.dispatch(actions.loadPeerReviews('1'));

    expect(store.getActions()[0].type).toEqual(actions.FETCH_PEER_REVIEWS);

  });

  it('createPeerReview should dispatch an action when user.id is defined', () => {
    const review = {
      review: 'Lorem ipsum',
      chosenQuizAnswerId: '1',
      rejectedQuizAnswerId: '1',
      targetAnswererId: '1'
    };

    const store = mockStore({
      user: { id: '1' },
      quizAnswers: {
        '1': {
          data: review
        }
      }
    });

    store.dispatch(actions.createPeerReview({ quizId: '2', sourceQuizId: '1' }));

    expect(store.getActions()[0].type).toEqual(actions.POST_PEER_REVIEWS);
  });
});
