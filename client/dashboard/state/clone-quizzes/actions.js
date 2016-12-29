import { createToast } from 'state/toaster';
import { replace } from 'react-router-redux';

export const SET_MODAL_DISPLAY = 'CLONE_QUIZZES_SET_MODAL_DISPLAY';
export const SET_METHOD = 'CLONE_QUIZZES_SET_METHOD';
export const SET_QUIZ = 'CLONE_QUIZZES_SET_QUIZ';
export const SET_TAGS_FROM = 'CLONE_QUIZZES_SET_TAGS_FROM';
export const SET_TAGS_TO = 'CLONE_QUIZZES_SET_TAGS_TO';
export const CLONE_QUIZZES = 'CLONE_QUIZZES_CLONE_QUIZZES';

export function setModalDisplay(isOpen) {
  return {
    type: SET_MODAL_DISPLAY,
    isOpen
  };
}

export function setTagsFrom(tags) {
  return {
    type: SET_TAGS_FROM,
    tags
  };
}

export function setTagsTo(tags) {
  return {
    type: SET_TAGS_TO,
    tags
  };
}

export function setQuiz(quizId) {
  return {
    type: SET_QUIZ,
    quizId
  };
}

export function setMethod(method) {
  return {
    type: SET_METHOD,
    method
  };
}

export function applyCloning() {
  return (dispatch, getState) => {
    const { cloneQuizzes: { quizId, tagsFrom, tagsTo, method } } = getState();

    if(!quizId && (!tagsFrom || tagsFrom.length === 0)) {
      return dispatch(createToast({
        type: 'danger',
        content: 'Either quiz or tags is required'
      }));
    }

    let promise = Promise.resolve();

    if(method === 'quiz') {
      promise = dispatch(cloneRequest({ quizId }));
    } else if(method === 'tags') {
      promise = dispatch(cloneRequest({ tagsFrom, tagsTo }));
    }

    return promise
      .then(response => {
        if(!response.error) {
          dispatch(replace('/dashboard/quizzes'));
          dispatch(toggleModal());
        } else {
          return dispatch(createToast({
            type: 'danger',
            content: 'Couldn\'t clone the quizzes'
          }));
        }
      });
  }
}

export function cloneRequest(data) {
  return {
    type: CLONE_QUIZZES,
    payload: {
      request: {
        url: '/quizzes/clone',
        data,
        method: 'POST'
      }
    }
  };
}

export function toggleModal() {
  return (dispatch, getState) => {
    const { cloneQuizzes: { modalIsOpen } } = getState();

    return dispatch(setModalDisplay(!modalIsOpen));
  };
}
