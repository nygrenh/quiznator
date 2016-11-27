import delay from 'lodash.delay';

export const ADD_TOAST = 'TOASTER_ADD_TOAST';
export const REMOVE_TOAST = 'TOASTER_REMOVE_TOAST';

let id = 0;

export function createToast({ type, content, duration = 5000 }) {
  return dispatch => {
    const newId = (id++).toString();

    dispatch(addToast({ type, content, id: newId }));

    delay(() => dispatch(removeToast(newId)), duration);
  }
}

export function removeToast(id) {
  return {
    type: REMOVE_TOAST,
    id
  }
}

export function addToast({ type, content, id }) {
  return {
    type: ADD_TOAST,
    toastType: type,
    content,
    id
  }
}
