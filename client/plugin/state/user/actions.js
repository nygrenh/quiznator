export const SET_USER = 'USER_SET_USER';

export function setUser(user) {
  return {
    type: SET_USER,
    user
  }
}
