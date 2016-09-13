import { refreshTokenIfExpires } from 'state/tokens';

export const includeAccessToken = ({ getState, dispatch }, config) => {
  if(config.url.indexOf('/oauth/quiznator-tokens') >= 0) {
    return config;
  } else {
    return dispatch(refreshTokenIfExpires())
      .then(() => {
        const { tokens } = getState();

        config.headers['Authorization'] = `Bearer ${tokens.accessToken}`;

        return config;
      });
  }
}

export const accessTokenErrorHandler = ({ getState, dispatch }, config) => {
  return config;
}
