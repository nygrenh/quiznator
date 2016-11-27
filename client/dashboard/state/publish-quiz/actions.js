export const SET_PUBLISH_QUIZ_MODAL_DISPLAY = 'PUBLISH_QUIZ_SET_PUBLISH_QUIZ_MODA_DISPLAY';
export const SET_QUIZ_TO_PUBLISH = 'PUBLISH_QUIZ_SET_QUIZ_TO_PUBLISH';

export function chooseQuizToPublish(quiz) {
  return dispatch => {
    dispatch(setQuizToPublish(quiz));
    dispatch(togglePublishQuizModal());
  }
}

export function setQuizToPublish(quiz) {
  return {
    type: SET_QUIZ_TO_PUBLISH,
    quiz
  }
}

export function togglePublishQuizModal() {
  return (dispatch, getState) => {
    const { publishQuiz } = getState();

    dispatch(setPublishQuizModalDisplay(!publishQuiz.modalIsOpen));
  }
}

export function setPublishQuizModalDisplay(isOpen) {
  return {
    type: SET_PUBLISH_QUIZ_MODAL_DISPLAY,
    isOpen
  }
}
