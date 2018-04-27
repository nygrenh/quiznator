export const MULTIPLE_CHOICE = 'MULTIPLE_CHOICE';
export const ESSAY = 'ESSAY';
export const OPEN = 'OPEN';
export const PEER_REVIEW = 'PEER_REVIEW';
export const PEER_REVIEWS_RECEIVED = 'PEER_REVIEWS_RECEIVED';
export const CHECKBOX = 'CHECKBOX';
export const PRIVACY_AGREEMENT = "PRIVACY_AGREEMENT";
export const SCALE = 'SCALE';
export const RADIO_MATRIX = 'RADIO_MATRIX'
export const MULTIPLE_OPEN = 'MULTIPLE_OPEN'

export const typeToLabel = {
  [MULTIPLE_CHOICE]: 'Multiple choice',
  [OPEN]: 'Open',
  [CHECKBOX]: 'Checkbox',
  [PRIVACY_AGREEMENT]: 'Privacy agreement',
  [ESSAY]: 'Essay',
  [PEER_REVIEW]: 'Give peer review',
  [PEER_REVIEWS_RECEIVED]: 'View peer reviews',
  [SCALE]: 'Scale',
  [RADIO_MATRIX]: 'Radio matrix',
  [MULTIPLE_OPEN]: 'Multiple open'
};

export const answerableTypes = [MULTIPLE_CHOICE, ESSAY, CHECKBOX, PRIVACY_AGREEMENT, OPEN, SCALE, RADIO_MATRIX, MULTIPLE_OPEN];
