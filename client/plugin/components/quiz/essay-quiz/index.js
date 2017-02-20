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

  getMinWords() {
    return lget(this.props, 'quiz.data.meta.minWords') || null;
  }

  getMaxWords() {
    return lget(this.props, 'quiz.data.meta.maxWords') || null;
  }

  onEssayChange() {
    this.props.onDataChange([], this.refs.essay.value);
  }

  renderPreferredWordCounts() {
    const boundaries = [
      this.getMinWords() ? `minimum number of words is ${this.getMinWords()}` : null,
      this.getMaxWords() ? `maximum number of words is ${this.getMaxWords()}` : null,
    ].filter(w => !!w);

    if (boundaries.length > 0) {
      return (
        <p>
          Preferred {boundaries.join(' and ')}
        </p>
      );
    } else {
      return null;
    }
  }

  wordCountIsAboveMax() {
    return this.getMaxWords() && this.getWordCount() > this.getMaxWords();
  }

  wordCountIsBelowMin() {
    return this.getMinWords() && this.getWordCount() < this.getMinWords();
  }

  renderWordCountInfo() {
    if (this.wordCountIsBelowMin()) {
      return 'Too short!'
    } else if (this.wordCountIsAboveMax()) {
      return 'Too long!';
    } else {
      return null;
    }
  }

  render() {
    const answerData = lget(this.props, 'answer.data') || '';
    const isValid = answerData.length > 0 && !this.wordCountIsBelowMin();
    const submitDisabled = !isValid || !!this.props.disabled || !!this.props.submitting;

    return (
      <form onSubmit={this.onSubmit()}>
        <div className={withClassPrefix('form-group')}>
          <textarea disabled={this.props.disabled} className={withClassPrefix('textarea')} value={answerData} rows={5} ref="essay" maxLength={20000} onChange={this.onEssayChange.bind(this)}>
          </textarea>
        </div>

        {this.renderPreferredWordCounts()}

        <p className={withClassPrefix('text-muted')}>
          Word count: {this.getWordCount()}. {this.renderWordCountInfo()}
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
