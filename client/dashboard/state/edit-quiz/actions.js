  import scour from 'scourjs';
import { push } from 'react-router-redux';

import { createToast } from 'state/toaster';

export const UPDATE_QUIZ = 'EDIT_QUIZ_UPDATE_QUIZ';
export const REMOVE_QUIZ = 'EDIT_QUIZ_REMOVE_QUIZ';
export const PUT_SAVE_QUIZ = 'EDIT_QUIZ_PUT_SAVE_QUIZ';
export const FETCH_QUIZ = 'EDIT_QUIZ_FETCH_QUIZ';
export const FETCH_QUIZ_SUCCESS = 'EDIT_QUIZ_FETCH_QUIZ_SUCCESS';
export const ADD_DATA_ITEM = 'EDIT_QUIZ_ADD_DATA_ITEM';
export const REMOVE_DATA_ITEM ='EDIT_QUIZ_REMOVE_DATA_ITEM';
export const UPDATE_DATA_ITEM = 'EDIT_QUIZ_UPDATE_DATA_ITEM';
export const UPDATE_DATA_META = 'EDIT_QUIZ_UPDATE_DATA_META';
export const UPDATE_DATA = 'EDIT_QUIZ_UPDATA_DATA';
export const SET_DATA_META_PATH = 'EDIT_QUIZ_SET_DATA_META_PATH';
//
export const ADD_DATA_CHOICE = 'EDIT_QUIZ_ADD_DATA_CHOICE';
export const REMOVE_DATA_CHOICE ='EDIT_QUIZ_REMOVE_DATA_CHOICE';
export const UPDATE_DATA_CHOICE = 'EDIT_QUIZ_UPDATE_DATA_CHOICE';

function id() {
  return (new Date().getTime()).toString(36) + Math.floor(Math.random() * 100).toString(36);
}

export function updateQuiz(update) {
  return {
    type: UPDATE_QUIZ,
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

export function removeQuiz() {
  return (dispatch, getState) => {
    const { editQuiz } = getState();

    dispatch(removeQuizRequest(editQuiz.result))
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

export function saveQuiz() {
  return (dispatch, getState) => {
    const state = getState();

    const quizId = state.editQuiz.result;
    const items = state.editQuiz.entities.items;
    const choices = state.editQuiz.entities.choices

    let newQuiz = scour(state.editQuiz.entities.quizzes[quizId])

    const quizItems = newQuiz.get('data', 'items');
    const quizChoices = newQuiz.get('data', 'choices')

    if (quizItems) {
      newQuiz = newQuiz.set(['data', 'items'], quizItems.map(id => items[id]));
    }
    if (quizChoices) {
      newQuiz = newQuiz.set(['data', 'choices'], quizChoices.map(id => choices[id]))
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

export function addDataItem(item) {
  const newId = id();

  return {
    type: ADD_DATA_ITEM,
    itemId: newId,
    item: Object.assign({}, item, { id: newId })
  }
}

export function updateDataItem(itemId, update) {
  return {
    type: UPDATE_DATA_ITEM,
    itemId,
    update
  }
}

export function removeDataItem(itemId) {
  return {
    type: REMOVE_DATA_ITEM,
    itemId
  }
}

//
export function addDataChoice(choice) {
  const newId = id();

  return {
    type: ADD_DATA_CHOICE,
    choiceId: newId,
    choice: Object.assign({}, choice, { id: newId })
  }
}

export function updateDataChoice(choiceId, update) {
  return {
    type: UPDATE_DATA_CHOICE,
    choiceId,
    update
  }  
}

export function removeDataChoice(choiceId) {
  return {
    type: REMOVE_DATA_CHOICE,
    choiceId
  }
}
//

export function updateDataMeta(update) {
  return {
    type: UPDATE_DATA_META,
    update
  }
}

export function setDataMetaPath(path, value) {
  return {
    type: SET_DATA_META_PATH,
    path,
    value
  }
}

export function updateData(update) {
  return {
    type: UPDATE_DATA,
    update
  }
}
