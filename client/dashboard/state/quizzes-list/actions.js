export const FETCH_QUIZZES_LIST = 'QUIZZES_LIST_FETCH_QUIZZES_LIST';
export const FETCH_QUIZZES_LIST_SUCCESS = 'QUIZZES_LIST_FETCH_QUIZZES_LIST_SUCCESS';

export function fetchQuizzesList() {
  return {
    type: FETCH_QUIZZES_LIST,
    payload: {
      request: {
        url: '/quizzes'
      }
    }
  }
}
