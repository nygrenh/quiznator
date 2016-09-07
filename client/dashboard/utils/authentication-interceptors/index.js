export const includeAccessToken = ({ getState, dispatch }, config) => {
  const { tokens } = getState();

  config.headers['authorization'] = `Bearer ${tokens.accessToken}`;

  return config;
}
