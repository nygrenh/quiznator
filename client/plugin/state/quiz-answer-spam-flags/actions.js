import _get from 'lodash.get';

export const FETCH_SPAM_FLAG = 'QUIZ_ANSWER_SPAM_FLAGS::FETCH_SPAM_FLAG';
export const FETCH_SPAM_FLAG_SUCCESS = 'QUIZ_ANSWER_SPAM_FLAGS::FETCH_SPAM_FLAG_SUCCESS';
export const MODIFY_SPAM_FLAG_REQUEST = 'QUIZ_ANSWER_SPAM_FLAGS::MODIFY_SPAM_FLAG_REQUEST';
export const CREATE_SPAM_FLAG = 'QUIZ_ANSWER_SPAM_FLAGS::CREATE_SPAM_FLAG';
export const REMOVE_SPAM_FLAG = 'QUIZ_ANSWER_SPAM_FLAGS::REMOVE_SPAM_FLAG';

export function fetchSpamFlag(answerId) {
  return {
    type: FETCH_SPAM_FLAG,
    answerId,
    payload: {
      request: {
        url: `/quiz-answers/${answerId}/spam-flags/mine`,
        method: 'GET'
      }
    }
  }
}

export function toggleSpamFlag(answerId) {
  return (dispatch, getState) => {
    const { quizAnswerSpamFlags } = getState();
    const flag = _get(quizAnswerSpamFlags, `${answerId}.flag`);

    if(flag === 0) {
      dispatch(createSpamFlag(answerId));
    } else if(flag === 1) {
      dispatch(removeSpamFlag(answerId));
    }

    return dispatch(modifySpamFlagRequest({ answerId, flag: flag === 0 ? 1 : 0 }));
  }
}

export function modifySpamFlagRequest({ answerId, flag }) {
  return {
    type: MODIFY_SPAM_FLAG_REQUEST,
    payload: {
      request: {
        url: `/quiz-answers/${answerId}/spam-flags`,
        method: 'POST',
        data: {
          flag
        }
      }
    }
  }
}

export function removeSpamFlag(answerId) {
  return {
    type: REMOVE_SPAM_FLAG,
    answerId
  }
}

export function createSpamFlag(answerId) {
  return {
    type: CREATE_SPAM_FLAG,
    answerId
  }
}
