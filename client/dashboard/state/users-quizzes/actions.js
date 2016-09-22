export const FETCH_QUIZZES = 'USERS_QUIZZES::FETCH_QUIZZES';
export const FETCH_QUIZ = 'USERS_QUIZZES::FETCH_QUIZ';

export function fetchQuizzes({ title, types }) {
  let params = {};

  if(title) {
    params = Object.assign({}, params, { title });
  }

  if(types) {
    params = Object.assign({}, params, { types: types.join(',') });
  }

  return {
    type: FETCH_QUIZZES,
    payload: {
      request: {
        url: '/quizzes',
        method: 'GET',
        params
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
