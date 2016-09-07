import { setTokens } from 'common-utils/authentication';

export const POST_SIGN_IN = 'SIGN_IN_POST_SIGN_IN';
export const POST_SIGN_IN_FAIL = 'SIGN_IN_POST_SIGN_IN_FAIL';

export function signIn() {
  return (dispatch, getState) => {
    const state = getState();

    const { email, password } = state.form.signInForm.values;

    return dispatch(postSignIn({ email, password }))
      .then(response => {
        if(!response.error && response.payload.data.access_token) {
          setTokens({
            accessToken: response.payload.data.access_token,
            refreshToken: response.payload.data.refresh_token,
            expiresIn: response.payload.data.expires_in,
            tokenType: response.payload.data.token_type
          });

          window.location.replace('/dashboard');
        }
      });
  }
}

export function postSignIn({ email, password }) {
  return {
    type: POST_SIGN_IN,
    payload: {
      request: {
        url: '/oauth/quiznator-tokens',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: `grant_type=password&username=${email}&password=${password}`
      }
    }
  }
}
