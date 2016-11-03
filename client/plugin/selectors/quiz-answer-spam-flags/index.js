import _get from 'lodash.get';

export const selectQuizAnswerSpamFlags = state => state.quizAnswerSpamFlags;

export const selectQuizAnswerIsSpamFlagged = (state, ownProps) => {
  return _get(state, `quizAnswerSpamFlags.${ownProps.answerId}.flag`) === 1 ? true : false;
}
