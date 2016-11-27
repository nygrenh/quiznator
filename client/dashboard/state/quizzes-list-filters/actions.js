import { push } from 'react-router-redux';

export const FETCH_TAGS = 'QUIZZES_LIST_FILTERS_FETCH_TAGS';
export const FETCH_TAGS_SUCCESS = 'QUIZZES_LIST_FILTERS_FETCH_TAGS_SUCCESS';
export const SET_TAGS = 'QUIZZES_LIST_FILTERS_SET_TAGS';
export const OPEN_MODAL = 'QUIZZES_LIST_FILTERS_OPEN_MODAL';
export const CLOSE_MODAL = 'QUIZZES_LIST_FILTERS_CLOSE_MODAL';

export function fetchTags() {
  return (dispatch, getState) => {
    const { _id: userId } = getState().user;

    return dispatch(fetchTagsRequest(userId));
  };
}

export function applyFilters() {
  return (dispatch, getState) => {
    const {
      routing: { locationBeforeTransitions: { pathname, query } },
      quizzesListFilters: { tags }
    } = getState();

    let newQuery = { ...query, page: 1 };

    if(tags && tags.length > 0) {
      newQuery = { ...newQuery, tags: tags.join(',') };
    } else {
      delete newQuery['tags'];
    }

    const newLocation = { pathname, query: newQuery };

    dispatch(push(newLocation));
    dispatch(closeModal());
  };
}

export function toggleModal() {
  return (dispatch, getState) => {
    const { quizzesListFilters: { modalIsOpen } } = getState();

    if(modalIsOpen) {
      return dispatch(closeModal());
    } else {
      return dispatch(openModal());
    }
  };
}

export function openModal() {
  return {
    type: OPEN_MODAL
  };
}

export function closeModal() {
  return {
    type: CLOSE_MODAL
  };
}

export function setTags(tags) {
  return {
    type: SET_TAGS,
    tags
  };
}
