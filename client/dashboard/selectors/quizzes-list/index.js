import _get from 'lodash.get';

export const selectQuizzes = state => {
  return _get(state, 'quizzesList.data.data');
}

export const selectTotalPages = state => {
  return _get(state, 'quizzesList.data.totalPages') || 0;
}

export const selectCurrentPage = state => {
  return state.quizzesList.currentPage;
}
