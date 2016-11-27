import _get from 'lodash.get';

export const selectQuizzes = state => {
  return _get(state, 'quizzesList.data.data');
}

export const selectTotalPages = state => {
  const { quizzesList: { data, pageSize } } = state;

  const total = _get(data, 'total') || 0;

  return Math.ceil(total / pageSize);
}

export const selectCurrentPage = state => {
  return state.quizzesList.currentPage;
}
