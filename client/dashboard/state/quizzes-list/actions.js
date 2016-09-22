export const FETCH_QUIZZES_LIST = 'QUIZZES_LIST::FETCH_QUIZZES_LIST';
export const FETCH_QUIZZES_LIST_SUCCESS = 'QUIZZES_LIST::FETCH_QUIZZES_LIST_SUCCESS';
export const SET_PAGE = 'QUIZZES_LIST::SET_PAGE';

export function fetchQuizzesList(page) {
  return {
    type: FETCH_QUIZZES_LIST,
    payload: {
      request: {
        url: `/quizzes?page=${page}`
      }
    }
  }
}

export function getQuizzesList() {
  return (dispatch, getState) => {
    const state = getState();

    return dispatch(fetchQuizzesList(state.quizzesList.currentPage));
  }
}

export function updatePage(page) {
  return (dispatch, getState) => {
    dispatch(setPage(page));
    dispatch(getQuizzesList(page));
  }
}

export function setPage(page) {
  return {
    type: SET_PAGE,
    page
  }
}
