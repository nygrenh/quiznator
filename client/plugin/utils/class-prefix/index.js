export const CLASS_PREFIX = 'quiznator';

function withClassPrefix(classNames = '') {
  return classNames.split(' ').map(className => `${CLASS_PREFIX}-${className}`).join(' ');
}

export default withClassPrefix;
