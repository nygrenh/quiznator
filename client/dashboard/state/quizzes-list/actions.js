import queryString from 'query-string';
import { push } from 'react-router-redux';

export const FETCH_QUIZZES_LIST = 'QUIZZES_LIST_FETCH_QUIZZES_LIST';
export const FETCH_QUIZZES_LIST_SUCCESS = 'QUIZZES_LIST_FETCH_QUIZZES_LIST_SUCCESS';
export const SET_PAGE = 'QUIZZES_LIST_SET_PAGE';

export function fetchQuizzesListRequest({ limit, skip, tags }) {
  const query = {
    limit,
    skip,
    ...(tags ? { tags: tags.join(',') } : {})
  };

  return {
    type: FETCH_QUIZZES_LIST,
    payload: {
      request: {
        url: `/quizzes?${queryString.stringify(query)}`
      }
    }
  }
}

export function fetchQuizzesList() {
  return (dispatch, getState) => {
    const {
      quizzesList: { currentPage, pageSize },
      quizzesListFilters: { tags }
    } = getState();

    const skip = (currentPage - 1) * pageSize;
    const limit = pageSize;

    return dispatch(fetchQuizzesListRequest({ limit, skip, tags }));
  }
}

export function updatePage(page) {
  return (dispatch, getState) => {
    const { routing: { locationBeforeTransitions: { pathname, query } } } = getState();

    const newQuery = Object.assign({}, query, { page });
    const newLocation = Object.assign({}, { pathname, query: newQuery });

    dispatch(push(newLocation));
  }
}

export function setPage(page) {
  return {
    type: SET_PAGE,
    page
  }
}
