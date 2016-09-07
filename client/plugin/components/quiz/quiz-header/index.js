import React from 'react';
import classNames from 'classnames';
import omit from 'lodash.omit';

import withClassPrefix from 'utils/class-prefix';

const QuizHeader = props => {
  const classes = withClassPrefix(classNames('quiz-container__header', {'quiz-container__header--active': props.isActive }));

  const answeredLabel = props.isActive
    ? <span className={withClassPrefix('pull-right quiz-answered-label')}>Answered</span>
    : null;

  return (
    <div className={classes} {...omit(props, ['isActive'])}>
      {answeredLabel}
      <h1>{props.children}</h1>
    </div>
  );
}

export default QuizHeader;
