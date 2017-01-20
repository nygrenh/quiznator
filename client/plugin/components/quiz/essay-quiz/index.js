import React from 'react';
import lget from 'lodash.get';

import { quizPropsTypes, quizDefaultProps } from 'components/quiz';

import SubmitButton from 'components/quiz/submit-button';

import withClassPrefix from 'utils/class-prefix';

class EssayQuiz extends React.Component {
  onSubmit() {
    return e => {
      e.preventDefault();

      this.props.onSubmit();
    }
  }

  getWordCount() {
    const content = (lget(this.props, 'answer.data') || '');

    return (content.match(/\S+/g) || []).length;
  }

  onEssayChange() {
    this.props.onDataChange([], this.refs.essay.value);
  }

  render() {
    const answerData = lget(this.props, 'answer.data') || '';
    const isValid = answerData.length > 0;
    const submitDisabled = !isValid || !!this.props.disabled || !!this.props.submitting;

    return (
      <form onSubmit={this.onSubmit()}>
        <div className={withClassPrefix('form-group')}>
          <textarea disabled={this.props.disabled} className={withClassPrefix('textarea')} value={answerData} rows={5} ref="essay" maxLength={20000} onChange={this.onEssayChange.bind(this)}>
          </textarea>
        </div>

        <p className={withClassPrefix('text-muted')}>
          Word count: {this.getWordCount()}
        </p>

        <div className={withClassPrefix('form-group')}>
          <SubmitButton disabled={submitDisabled} submitting={this.props.submitting} submitted={this.props.answerSubmitted}/>
        </div>
      </form>
    )
  }
}

EssayQuiz.propTypes = quizPropsTypes;
EssayQuiz.defaultProps = quizDefaultProps;

export default EssayQuiz;
