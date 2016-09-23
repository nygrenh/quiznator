import { change, untouch } from 'redux-form';
import { push } from 'react-router-redux';
import _get from 'lodash.get';

import { CHECKBOX, ESSAY, MULTIPLE_CHOICE, PEER_REVIEW, PEER_REVIEWS_RECEIVED } from 'common-constants/quiz-types';
import { fetchQuizzesList } from 'state/quizzes-list';

export const CHOOSE_QUIZ_TYPE = 'CREATE_QUIZ::CHOOSE_QUIZ_TYPE';
export const SET_CREATE_QUIZ_MODAL_DISPLAY = 'CREATE_QUIZ::SET_CREATE_QUIZ_MODAL_DISPLAY';
export const POST_CREATE_QUIZ = 'CREATE_QUIZ::POST_CREATE_QUIZ';

function createEmptyQuiz({ title, type }) {
  const base = {
    title,
    body: '',
    type
  };

  switch (type) {
    case MULTIPLE_CHOICE:
    case CHECKBOX:
      return Object.assign({}, base, { data: { items: [], meta: {} } });
      break;
    default:
      return Object.assign({}, base, { data: {} });
  }
}

export function resetForm() {
  return dispatch => {
    dispatch(untouch('createQuiz', 'title'));
    dispatch(change('createQuiz', 'title', ''));
  }
}

export function toggleCreateQuizModal() {
  return (dispatch, getState) => {
    const { createQuiz } = getState();

    dispatch(setCreateQuizModalDisplay(!createQuiz.modalIsOpen));
    dispatch(resetForm());
  }
}

export function postCreateQuiz(quiz) {
  return {
    type: POST_CREATE_QUIZ,
    payload: {
      request: {
        url: '/quizzes',
        method: 'POST',
        data: quiz
      }
    }
  }
}

export function setCreateQuizModalDisplay(isOpen) {
  return {
    type: SET_CREATE_QUIZ_MODAL_DISPLAY,
    isOpen
  }
}

export function chooseQuizType(quizType) {
  return {
    type: CHOOSE_QUIZ_TYPE,
    quizType
  }
}

export function createQuiz() {
  return (dispatch, getState) => {
    const state = getState();

    const title = _get(state, 'form.createQuiz.values.title');
    const type = _get(state, 'createQuiz.quizType');
    const newQuiz = createEmptyQuiz({ title, type });

    return dispatch(postCreateQuiz(newQuiz))
      .then(response => {
        dispatch(toggleCreateQuizModal());
        dispatch(resetForm());
        dispatch(push(`/dashboard/quizzes/${response.payload.data._id}/edit`));
      });
  }
}
