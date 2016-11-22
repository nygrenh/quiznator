export const MULTIPLE_CHOICE = 'MULTIPLE_CHOICE';
export const ESSAY = 'ESSAY';
export const OPEN = 'OPEN';
export const PEER_REVIEW = 'PEER_REVIEW';
export const PEER_REVIEWS_RECEIVED = 'PEER_REVIEWS_RECEIVED';
export const CHECKBOX = 'CHECKBOX';

export const typeToLabel = {
  [MULTIPLE_CHOICE]: 'Multiple choice',
  [OPEN]: 'Open',
  [CHECKBOX]: 'Checkbox',
  [ESSAY]: 'Essay',
  [PEER_REVIEW]: 'Give peer review',
  [PEER_REVIEWS_RECEIVED]: 'View peer reviews'
}

export const answerableTypes = [MULTIPLE_CHOICE, ESSAY, CHECKBOX, OPEN];
