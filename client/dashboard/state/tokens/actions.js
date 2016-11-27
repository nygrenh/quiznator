import * as authentication from 'common-utils/authentication';

export const UPDATE_TOKENS = 'TOKENS_UPDATE_TOKENS';
export const POST_REFRESH_TOKENS = 'TOKENS_POST_REFRESH_TOKENS';
export const DELETE_TOKENS = 'TOKENS_DELETE_TOKENS';

export function updateTokens(update) {
  return {
    type: UPDATE_TOKENS,
    update
  }
}

export function refreshTokenIfExpires() {
  return (dispatch, getState) => {
    const { tokens } = getState();

    const now = Math.floor(+(new Date()) / 1000);
    const thresholdInSeconds = 60 * 15;

    if(tokens.expires - now < thresholdInSeconds) {
      return dispatch(refreshToken());
    } else {
      return Promise.resolve();
    }
  }
}

export function refreshToken() {
  return (dispatch, getState) => {
    const { tokens } = getState();

    if(tokens.refreshTokenPromise) {
      return tokens.refreshTokenPromise;
    } else {
      const refreshTokenPromise = dispatch(postRefreshToken(tokens.refreshToken));

      dispatch(updateTokens({ refreshTokenPromise }));

      return refreshTokenPromise
        .then(response => {
          if(response.error) {
            authentication.removeTokens();
            window.location.replace('/sign-in');
          } else {
            const data = response.payload.data;

            const newTokens = {
              accessToken: data.access_token,
              refreshToken: data.refresh_token,
              expires:  Math.floor(+(new Date()) / 1000) + data.expires_in
            }

            authentication.updateTokens(newTokens);
            dispatch(updateTokens(newTokens));
          }
        });
    }
  }
}

export function signOut() {
  return (dispatch) => {
    dispatch(deleteTokens())
      .then(response => {
        if(!response.error) {
          authentication.removeTokens();
          window.location.replace('/sign-in');
        }
      });
  }
}

export function deleteTokens() {
  return {
    type: DELETE_TOKENS,
    payload: {
      request: {
        url: '/oauth/tokens',
        method: 'DELETE'
      }
    }
  }
}

export function postRefreshToken(refreshToken) {
  return {
    type: POST_REFRESH_TOKENS,
    payload: {
      request: {
        url: '/oauth/quiznator-tokens',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: `grant_type=refresh_token&refresh_token=${refreshToken}`
      }
    }
  }
}
