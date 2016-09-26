import scour from 'scourjs';
import { push } from 'react-router-redux';

import { createToast } from 'state/toaster';

export const UPDATE_QUIZ = 'EDIT_QUIZ::UPDATE_QUIZ';
export const REMOVE_QUIZ = 'EDIT_QUIZ::REMOVE_QUIZ';
export const PUT_SAVE_QUIZ = 'EDIT_QUIZ::PUT_SAVE_QUIZ';
export const FETCH_QUIZ = 'EDIT_QUIZ::FETCH_QUIZ';
export const FETCH_QUIZ_SUCCESS = 'EDIT_QUIZ::FETCH_QUIZ_SUCCESS';
export const ADD_DATA_ITEM = 'EDIT_QUIZ::ADD_DATA_ITEM';
export const REMOVE_DATA_ITEM ='EDIT_QUIZ::REMOVE_DATA_ITEM';
export const UPDATE_DATA_ITEM = 'EDIT_QUIZ::UPDATE_DATA_ITEM';
export const UPDATE_DATA_META = 'EDIT_QUIZ::UPDATE_DATA_META';
export const UPDATE_DATA = 'EDIT_QUIZ::UPDATA_DATA';
export const SET_DATA_META_PATH = 'EDIT_QUIZ::SET_DATA_META_PATH';

function id() {
  return (new Date().getTime()).toString(36) + Math.floor(Math.random() * 100).toString(36);
}

export function updateQuiz(quizId, update) {
  return {
    type: UPDATE_QUIZ,
    quizId,
    update
  }
}

export function fetchQuiz(quizId) {
  return {
    type: FETCH_QUIZ,
    quizId,
    payload: {
      request: {
        url: `/quizzes/${quizId}`,
        method: 'GET'
      }
    }
  }
}

export function saveQuizRequest(quizId, update) {
  return {
    type: PUT_SAVE_QUIZ,
    payload: {
      request: {
        url: `/quizzes/${quizId}`,
        method: 'PUT',
        data: update
      }
    }
  }
}

export function removeQuiz(quizId) {
  return dispatch => {
    dispatch(removeQuizRequest(quizId))
      .then(response => {
        dispatch(push('/dashboard/quizzes'));

        dispatch(createToast({
          type: 'success',
          content: 'Quiz has been removed'
        }));
      });
  }
}

export function removeQuizRequest(quizId) {
  return {
    type: REMOVE_QUIZ,
    payload: {
      request: {
        url: `/quizzes/${quizId}`,
        method: 'DELETE'
      }
    }
  }
}

export function saveQuiz(quizId) {
  return (dispatch, getState) => {
    const state = getState();

    const items = state.quizzes.entities.items;

    let newQuiz = scour(state.quizzes.entities.quizzes[quizId])

    const quizItems = newQuiz.get('data', 'items');

    if(quizItems) {
      newQuiz = newQuiz.set(['data', 'items'], quizItems.map(id => items[id]));
    }

    return dispatch(saveQuizRequest(quizId, newQuiz.value))
      .then(response => {
        if(response.error) {
          dispatch(createToast({
            type: 'danger',
            content: 'Couldn\'t save the quiz'
          }));
        } else {
          dispatch(createToast({
            type: 'success',
            content: 'Quiz has been saved'
          }));
        }
      });
  }
}

export function addDataItem(quizId, item) {
  const newId = id();

  return {
    type: ADD_DATA_ITEM,
    itemId: newId,
    quizId,
    item: Object.assign({}, item, { id: newId })
  }
}

export function updateDataItem(quizId, itemId, update) {
  return {
    type: UPDATE_DATA_ITEM,
    quizId,
    itemId,
    update
  }
}

export function removeDataItem(quizId, itemId) {
  return {
    type: REMOVE_DATA_ITEM,
    quizId,
    itemId
  }
}

export function updateDataMeta(quizId, update) {
  return {
    type: UPDATE_DATA_META,
    quizId,
    update
  }
}

export function setDataMetaPath(quizId, path, value) {
  return {
    type: SET_DATA_META_PATH,
    quizId,
    path,
    value
  }
}

export function updateData(quizId, update) {
  return {
    type: UPDATE_DATA,
    quizId,
    update
  }
}
