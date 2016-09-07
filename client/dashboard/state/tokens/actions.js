export const UPDATE_TOKENS = 'TOKENS_UPDATE_TOKENS';
//export const POST_REFRESH_TOKENS 

export function updateTokens(update) {
  return {
    type: UPDATE_TOKENS,
    update
  }
}
