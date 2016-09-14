export const UPDATE_QUIZ = 'EDIT_QUIZ_UPDATE_QUIZ';
export const FETCH_QUIZ = 'EDIT_QUIZ_FETCH_QUIZ';
export const FETCH_QUIZ_SUCCESS = 'EDIT_QUIZ_FETCH_QUIZ_SUCCESS';
export const ADD_DATA_ITEM = 'EDIT_QUIZ_ADD_DATA_ITEM';
export const REMOVE_DATA_ITEM ='EDIT_QUIZ_REMOVE_DATA_ITEM';
export const UPDATE_DATA_ITEM = 'EDIT_QUIZ_UPDATE_DATA_ITEM';
export const UPDATE_DATA_META = 'EDIT_QUIZ_UPDATE_DATA_META';
export const UPDATE_DATA = 'EDIT_QUIZ_UPDATA_DATA';

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
    payload: {
      request: {
        url: `/quizzes/${quizId}`,
        method: 'GET'
      }
    }
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

export function updateDataMeta(update) {
  return {
    type: UPDATE_DATA_META,
    update
  }
}

export function updateData(update) {
  return {
    type: UPDATE_DATA,
    update
  }
}
