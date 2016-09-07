import delay from 'lodash.delay';

export const CREATE_ALERT = 'QUIZ_ALERTS_CREATE_ALERT';
export const REMOVE_ALERT = 'QUIZ_ALERTS_REMOVE_ALERT';

let newId = 0;

export function createTemporalAlert({ quizId, type, content, removeDelay = 5000 }) {
  return (dispatch, getState) => {
    const id = newId++;

    dispatch(createAlert({ quizId, type, content, id }));

    delay(() => dispatch(removeAlert({ id, quizId })), removeDelay);
  }
}

export function createAlert({ quizId, type, content, id }) {
  if(id === undefined) {
    id = newId++;
  }

  return {
    type: CREATE_ALERT,
    quizId,
    alertType: type,
    content,
    id
  }
}

export function removeAlert({ quizId, id }) {
  return {
    type: REMOVE_ALERT,
    id,
    quizId
  }
}
