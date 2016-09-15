export const FETCH_QUIZZES = 'USERS_QUIZZES_FETCH_QUIZZES';
export const FETCH_QUIZ = 'USERS_QUIZZES_FETCH_QUIZ';

export function fetchQuizzes({ title }) {
  const searchSuffix = title
    ? `?title=${decodeURIComponent(title)}`
    : '';

  return {
    type: FETCH_QUIZZES,
    payload: {
      request: {
        url: `/quizzes/${searchSuffix}`,
        method: 'GET'
      }
    }
  }
}

export function fetchQuiz(id) {
  return {
    type: FETCH_QUIZ,
    payload: {
      request: {
        url: `/quizzes/${id}`,
        method: 'GET'
      }
    }
  }
}
