import store from 'store';

export function setTokens({ accessToken, refreshToken, expiresIn, tokenType }) {
  store.set('tokens', {
    accessToken,
    refreshToken,
    tokenType,
    expires: Math.floor(+(new Date()) / 1000) + expiresIn
  });
}

export function redirectToSignIn() {
  window.location.replace('/sign-in');
}

export function updateTokens(update) {
  const tokens = store.get('tokens') || {};

  store.set('tokens', Object.assign({}, tokens, update));
}

export function getTokens() {
  return store.get('tokens');
}

export function userHasTokens() {
  return !!getTokens();
}

export function removeTokens() {
  return store.remove('tokens');
}
