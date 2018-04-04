import { change, untouch } from 'redux-form';
import { push } from 'react-router-redux';
import _get from 'lodash.get';

import { CHECKBOX, PRIVACY_AGREEMENT, ESSAY, MULTIPLE_CHOICE, PEER_REVIEW, PEER_REVIEWS_RECEIVED, SCALE } from 'common-constants/quiz-types';
import { fetchQuizzesList } from 'state/quizzes-list';

export const CHOOSE_QUIZ_TYPE = 'CREATE_QUIZ_CHOOSE_QUIZ_TYPE';
export const SET_MODAL_DISPLAY = 'CREATE_QUIZ_SET_MODAL_DISPLAY';
export const POST_CREATE_QUIZ = 'CREATE_QUIZ_POST_CREATE_QUIZ';

function createEmptyQuiz({ title, type }) {
  const base = {
    title,
    body: '',
    type
  };

  switch (type) {
    case MULTIPLE_CHOICE:
    case CHECKBOX:
    case PRIVACY_AGREEMENT:
      return Object.assign({}, base, { data: { items: [], meta: {} } });
      break;
    case SCALE:
      return Object.assign({}, base, { data: { items: [], scale: 7, meta: {} } });
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

export function toggleModal() {
  return (dispatch, getState) => {
    const { createQuiz } = getState();

    dispatch(setModalDisplay(!createQuiz.modalIsOpen));
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

export function setModalDisplay(isOpen) {
  return {
    type: SET_MODAL_DISPLAY,
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
        dispatch(push(`/dashboard/quizzes/${response.payload.data._id}/edit`));
        dispatch(toggleCreateQuizModal());
        dispatch(resetForm());
      });
  }
}
