export const accessTokenInterceptor = ({ getState, dispatch }, config) => {
  const { user } = getState();

  if(user && user.accessToken) {
    config.headers['Authorization'] = `Bearer ${user.accessToken}`;
  }

  return config;
}
