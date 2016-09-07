export const FETCH_PROFILE = 'USER_FETCH_PROFILE';
export const FETCH_PROFILE_SUCCESS = 'USER_FETCH_PROFILE_SUCCESS';

export function fetchProfile() {
  return {
    type: FETCH_PROFILE,
    payload: {
      request: {
        url: '/users/profile',
        method: 'GET'
      }
    }
  }
}
