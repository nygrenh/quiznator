export const FETCH_PROFILE = 'USER_FETCH_PROFILE';
export const FETCH_PROFILE_SUCCESS = 'USER_FETCH_PROFILE_SUCCESS';
export const FETCH_TAGS = 'USER_FETCH_TAGS';
export const FETCH_TAGS_SUCCESS = 'USER_FETCH_TAGS_SUCCESS';

export function fetchProfile() {
  return {
    type: FETCH_PROFILE,
    payload: {
      request: {
        url: '/users/profile',
        method: 'GET'
      }
    }
  };
}

export function fetchTags() {
  return (dispatch, getState) => {
    const { _id: userId } = getState().user;

    return dispatch(fetchTagsRequest(userId));
  };
}

export function fetchTagsRequest(userId) {
  return {
    type: FETCH_TAGS,
    payload: {
      request: {
        url: `/users/${userId}/tags`,
        method: 'GET'
      }
    }
  };
}
