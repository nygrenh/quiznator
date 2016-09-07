import React from 'react';
import get from 'lodash.get';

import { quizPropsTypes, quizDefaultProps } from 'components/quiz';

import withClassPrefix from 'utils/class-prefix';

class EssayQuiz extends React.Component {
  constructor(props) {
    super(props);
  }

  onSubmit() {
    return e => {
      e.preventDefault();

      this.props.onSubmit();
    }
  }

  onEssayChange() {
    this.props.onData(this.refs.essay.value);
  }

  render() {
    const answerData = get(this.props, 'answer.data') || '';
    const isValid = answerData.length > 0;

    return (
      <form onSubmit={this.onSubmit()}>
        <div className={withClassPrefix('form-group')}>
          <textarea disabled={this.props.disabled} className={withClassPrefix('textarea')} value={answerData} rows={5} ref="essay" onChange={this.onEssayChange.bind(this)}>
          </textarea>
        </div>

        <div className={withClassPrefix('form-group')}>
          <button type="submit" className={withClassPrefix('btn btn-primary')} disabled={!isValid}>Submit</button>
        </div>
      </form>
    )
  }
}

EssayQuiz.propTypes = quizPropsTypes;
EssayQuiz.defaultProps = quizDefaultProps;

export default EssayQuiz;
