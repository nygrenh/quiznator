export const SET_EDITING_QUIZ = 'EDIT_QUIZ_SET_EDITING_QUIZ';
export const SET_EDIT_QUIZ_MODAL_DISPLAY = 'EDIT_QUIZ_SET_EDIT_QUIZ_MODAL_DISPLAY';
export const UPDATE_QUIZ = 'EDIT_QUIZ_UPDATE_QUIZ';
export const ADD_DATA_ITEM = 'EDIT_QUIZ_ADD_DATA_ITEM';
export const REMOVE_DATA_ITEM ='EDIT_QUIZ_REMOVE_DATA_ITEM';
export const UPDATE_DATA_ITEM = 'EDIT_QUIZ_UPDATE_DATA_ITEM';
export const UPDATE_DATA_META = 'EDIT_QUIZ_UPDATE_DATA_META';
export const UPDATE_DATA_FIELD = 'EDIT_QUIZ_UPDATA_DATA_FIELD';

function id() {
  return (new Date().getTime()).toString(36) + Math.floor(Math.random() * 100).toString(36);
}

export function startEditingQuiz(quiz) {
  return (dispatch, getState) => {
    dispatch(setEditingQuiz(quiz));
    dispatch(setEditQuizModalDisplay(true));
  }
}

export function setEditingQuiz(quiz) {
  return {
    type: SET_EDITING_QUIZ,
    quiz
  }
}

export function updateQuiz(update) {
  return {
    type: UPDATE_QUIZ,
    update
  }
}

export function addDataItem(item) {
  return {
    type: ADD_DATA_ITEM,
    itemId: id(),
    item
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

export function updateDataField(field, update) {
  return {
    type: UPDATE_DATA_FIELD,
    field,
    update
  }
}

export function toggleEditQuizModal() {
  return (dispatch, getState) => {
    const { editQuiz } = getState();

    dispatch(setEditQuizModalDisplay(!editQuiz.modalIsOpen));
  }
}

export function setEditQuizModalDisplay(isOpen) {
  return {
    type: SET_EDIT_QUIZ_MODAL_DISPLAY,
    isOpen
  }
}
