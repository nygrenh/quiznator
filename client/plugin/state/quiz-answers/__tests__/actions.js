import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import expect from 'expect';

import * as actions from '../actions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Quiz answers actions', () => {

  it('createQuizAnswer should return a function', () => {
    expect(actions.createQuizAnswer({ quizId: '1', data: {} })).toBeA(Function);
  });

  it('createQuizAnswer should not create a quiz answer if quiz is not loaded or user.id is not defined', () => {
    const getState = () => ({
      user: {},
      quizzes: {}
    });

    const dispatch = expect.createSpy();

    actions.createQuizAnswer({ quizId: '1', data: {} })(dispatch, getState);

    expect(dispatch).toNotHaveBeenCalled();
  });


  it('createQuizAnswer should create a quiz answer if quiz is loaded and user.id is defined', () => {
    const store = mockStore({
      user: {
        id: '1'
      },
      quizzes: {
        '1': {
          data: {}
        }
      }
    });

    store.dispatch(actions.createQuizAnswer({ quizId: '1', data: {} }));

    expect(store.getActions()[0].type).toEqual(actions.POST_QUIZ_ANSWER);
  });
});
