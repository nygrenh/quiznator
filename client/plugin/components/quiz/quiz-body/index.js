import React from 'react';
import classNames from 'classnames';

import withClassPrefix from 'utils/class-prefix';

const QuizBody = props => {
  return (
    <div className={withClassPrefix('quiz-container__body')}>
      {props.children}
    </div>
  );
}

export default QuizBody;
