import get from 'lodash.get';

export const selectQuizzes = state => {
  return get(state, 'quizzesList.data.data') || [];
}

export const selectTotalPages = state => {
  return get(state, 'quizzesList.data.totalPages') || 0;
}

export const selectCurrentPage = state => {
  return state.quizzesList.currentPage;
}
