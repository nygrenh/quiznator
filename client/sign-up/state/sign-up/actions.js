import { setTokens } from 'common-utils/authentication';

export const POST_SIGN_UP = 'SIGN_UP_POST_SIGN_UP';
export const POST_AUTH_CODE = 'SIGN_UP_POST_AUTH_CODE';

export function signUp() {
  return (dispatch, getState) => {
    const { form } = getState();
    const { name, email, password } = form.signUpForm.values;

    return dispatch(postSignUp({ name, email, password }))
      .then(response => {
        if(!response.error) {
          return dispatch(postAuthCode(response.payload.data.authCode));
        } else {
          return Promise.reject(response.error);
        }
      })
      .then(response => {
        if(!response.error) {
          setTokens({
            accessToken: response.payload.data.access_token,
            refreshToken: response.payload.data.refresh_token,
            expiresIn: response.payload.data.expires_in,
            tokenType: response.payload.data.token_type
          });

          window.location.replace('/dashboard');
        } else {
          return Promise.reject(response.error);
        }
      });
  }
}

export function postSignUp({ name, email, password }) {
  return {
    type: POST_SIGN_UP,
    payload: {
      request: {
        url: '/users',
        method: 'POST',
        data: {
          name,
          email,
          password
        }
      }
    }
  }
}

export function postAuthCode(authCode) {
  return {
    type: POST_AUTH_CODE,
    payload: {
      request: {
        url: '/oauth/quiznator-tokens',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: `grant_type=authorization_code&code=${authCode}`
      }
    }
  }
}
